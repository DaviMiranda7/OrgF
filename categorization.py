from flask import Blueprint, request, jsonify
from src.models.user import db
from src.services.categorization_service import CategorizationService

categorization_bp = Blueprint('categorization', __name__)

@categorization_bp.route('/categorization/suggest', methods=['POST'])
def suggest_categories():
    """Sugerir categorias para uma transação"""
    try:
        data = request.get_json()
        
        if 'description' not in data or 'user_id' not in data:
            return jsonify({'error': 'description e user_id são obrigatórios'}), 400
        
        description = data['description']
        user_id = data['user_id']
        limit = data.get('limit', 3)
        
        # Inicializar serviço de categorização
        categorization_service = CategorizationService()
        
        # Obter sugestões
        suggestions = categorization_service.suggest_categories(description, user_id, limit)
        
        return jsonify({
            'description': description,
            'suggestions': suggestions,
            'total_suggestions': len(suggestions)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categorization_bp.route('/categorization/auto-categorize', methods=['POST'])
def auto_categorize_transaction():
    """Categorizar automaticamente uma transação"""
    try:
        data = request.get_json()
        
        required_fields = ['description', 'amount', 'user_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} é obrigatório'}), 400
        
        description = data['description']
        amount = float(data['amount'])
        user_id = data['user_id']
        
        # Inicializar serviço de categorização
        categorization_service = CategorizationService()
        
        # Categorizar transação
        suggested_category_id = categorization_service.categorize_transaction(
            description, amount, user_id
        )
        
        if suggested_category_id:
            # Obter informações da categoria sugerida
            from src.models.category import Category
            category = Category.query.get(suggested_category_id)
            
            return jsonify({
                'description': description,
                'suggested_category': {
                    'id': category.id,
                    'name': category.name,
                    'type': category.category_type,
                    'color': category.color,
                    'icon': category.icon
                },
                'confidence': 'high'  # Pode ser melhorado com score real
            }), 200
        else:
            return jsonify({
                'description': description,
                'suggested_category': None,
                'message': 'Não foi possível categorizar automaticamente'
            }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categorization_bp.route('/categorization/batch-categorize', methods=['POST'])
def batch_categorize_transactions():
    """Categorizar em lote transações sem categoria"""
    try:
        data = request.get_json()
        
        if 'user_id' not in data:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        user_id = data['user_id']
        limit = data.get('limit', 100)
        
        # Inicializar serviço de categorização
        categorization_service = CategorizationService()
        
        # Executar categorização em lote
        results = categorization_service.batch_categorize(user_id, limit)
        
        # Salvar alterações no banco
        db.session.commit()
        
        return jsonify({
            'message': 'Categorização em lote concluída',
            'results': results
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categorization_bp.route('/categorization/create-rule', methods=['POST'])
def create_categorization_rule():
    """Criar regra personalizada de categorização"""
    try:
        data = request.get_json()
        
        required_fields = ['user_id', 'keyword', 'category_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} é obrigatório'}), 400
        
        user_id = data['user_id']
        keyword = data['keyword']
        category_id = data['category_id']
        
        # Inicializar serviço de categorização
        categorization_service = CategorizationService()
        
        # Criar regra
        success = categorization_service.create_categorization_rule(
            user_id, keyword, category_id
        )
        
        if success:
            return jsonify({
                'message': 'Regra de categorização criada com sucesso',
                'keyword': keyword,
                'category_id': category_id
            }), 201
        else:
            return jsonify({'error': 'Categoria não encontrada ou inválida'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categorization_bp.route('/categorization/analyze-patterns', methods=['GET'])
def analyze_categorization_patterns():
    """Analisar padrões de categorização do usuário"""
    try:
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        from src.models.transaction import Transaction
        from src.models.category import Category
        
        # Buscar transações categorizadas do usuário
        categorized_transactions = Transaction.query.filter(
            Transaction.user_id == user_id,
            Transaction.category_id.isnot(None)
        ).all()
        
        # Analisar padrões
        patterns = {}
        category_stats = {}
        
        for transaction in categorized_transactions:
            category_name = transaction.category.name if transaction.category else 'Sem categoria'
            
            # Estatísticas por categoria
            if category_name not in category_stats:
                category_stats[category_name] = {
                    'count': 0,
                    'total_amount': 0,
                    'avg_amount': 0,
                    'descriptions': []
                }
            
            category_stats[category_name]['count'] += 1
            category_stats[category_name]['total_amount'] += abs(transaction.amount)
            category_stats[category_name]['descriptions'].append(transaction.description)
        
        # Calcular médias
        for category_name, stats in category_stats.items():
            stats['avg_amount'] = stats['total_amount'] / stats['count'] if stats['count'] > 0 else 0
            # Manter apenas as 5 descrições mais recentes
            stats['descriptions'] = stats['descriptions'][-5:]
        
        # Ordenar por frequência
        sorted_categories = sorted(
            category_stats.items(),
            key=lambda x: x[1]['count'],
            reverse=True
        )
        
        return jsonify({
            'user_id': user_id,
            'total_categorized_transactions': len(categorized_transactions),
            'category_patterns': dict(sorted_categories[:10]),  # Top 10 categorias
            'analysis_summary': {
                'most_used_category': sorted_categories[0][0] if sorted_categories else None,
                'total_categories_used': len(category_stats),
                'avg_transactions_per_category': len(categorized_transactions) / len(category_stats) if category_stats else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

