from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from src.models.user import db
from src.models.transaction import Transaction
from src.models.category import Category
from src.models.budget import Budget, Goal
import json

ai_advisor_bp = Blueprint('ai_advisor', __name__)

class FinancialAdvisor:
    """Classe para simular o assessor financeiro IA"""
    
    def __init__(self):
        self.knowledge_base = {
            'emergency_fund': {
                'description': 'Reserva de emergência é fundamental para segurança financeira',
                'recommendation': 'Mantenha de 3 a 6 meses de gastos essenciais em uma reserva de emergência'
            },
            'debt_management': {
                'description': 'Gestão de dívidas é crucial para saúde financeira',
                'recommendation': 'Priorize quitar dívidas com juros altos primeiro, como cartão de crédito'
            },
            'investment_basics': {
                'description': 'Investimentos são importantes para crescimento patrimonial',
                'recommendation': 'Comece com investimentos de baixo risco como Tesouro Direto e CDBs'
            },
            'budgeting': {
                'description': 'Orçamento é a base de uma vida financeira organizada',
                'recommendation': 'Use a regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança'
            }
        }
    
    def analyze_user_finances(self, user_id):
        """Analisar as finanças do usuário"""
        try:
            # Obter transações dos últimos 3 meses
            three_months_ago = datetime.utcnow() - timedelta(days=90)
            transactions = Transaction.query.filter(
                Transaction.user_id == user_id,
                Transaction.date >= three_months_ago
            ).all()
            
            # Calcular totais
            total_income = sum(t.amount for t in transactions if t.transaction_type == 'income')
            total_expense = sum(t.amount for t in transactions if t.transaction_type == 'expense')
            balance = total_income - total_expense
            
            # Analisar gastos por categoria
            expense_by_category = {}
            for transaction in transactions:
                if transaction.transaction_type == 'expense':
                    category_name = transaction.category.name if transaction.category else 'Sem categoria'
                    expense_by_category[category_name] = expense_by_category.get(category_name, 0) + transaction.amount
            
            # Obter orçamentos ativos
            active_budgets = Budget.query.filter_by(user_id=user_id, is_active=True).all()
            
            # Obter metas
            goals = Goal.query.filter_by(user_id=user_id, is_achieved=False).all()
            
            return {
                'total_income': total_income,
                'total_expense': total_expense,
                'balance': balance,
                'expense_by_category': expense_by_category,
                'active_budgets': len(active_budgets),
                'pending_goals': len(goals),
                'transaction_count': len(transactions)
            }
        except Exception as e:
            return None
    
    def generate_insights(self, user_analysis):
        """Gerar insights baseados na análise financeira"""
        insights = []
        
        if not user_analysis:
            return ['Não foi possível analisar suas finanças. Adicione algumas transações primeiro.']
        
        # Insight sobre saldo
        if user_analysis['balance'] > 0:
            insights.append(f"✅ Parabéns! Você teve um saldo positivo de R$ {user_analysis['balance']:.2f} nos últimos 3 meses.")
        else:
            insights.append(f"⚠️ Atenção: Você teve um saldo negativo de R$ {abs(user_analysis['balance']):.2f} nos últimos 3 meses.")
        
        # Insight sobre gastos por categoria
        if user_analysis['expense_by_category']:
            highest_expense_category = max(user_analysis['expense_by_category'], key=user_analysis['expense_by_category'].get)
            highest_amount = user_analysis['expense_by_category'][highest_expense_category]
            insights.append(f"📊 Sua maior categoria de gastos é '{highest_expense_category}' com R$ {highest_amount:.2f}.")
        
        # Insight sobre orçamentos
        if user_analysis['active_budgets'] == 0:
            insights.append("💡 Considere criar orçamentos para controlar melhor seus gastos.")
        
        # Insight sobre metas
        if user_analysis['pending_goals'] == 0:
            insights.append("🎯 Que tal definir algumas metas financeiras para se motivar?")
        
        return insights
    
    def answer_question(self, question, user_id=None):
        """Responder perguntas sobre finanças"""
        question_lower = question.lower()
        
        # Análise do usuário se fornecido
        user_analysis = None
        if user_id:
            user_analysis = self.analyze_user_finances(user_id)
        
        # Respostas baseadas em palavras-chave
        if any(word in question_lower for word in ['reserva', 'emergência', 'emergencia']):
            response = self.knowledge_base['emergency_fund']['recommendation']
            if user_analysis and user_analysis['balance'] > 0:
                response += f" Com base no seu saldo atual, considere separar parte dos seus R$ {user_analysis['balance']:.2f} para a reserva."
            return response
        
        elif any(word in question_lower for word in ['dívida', 'divida', 'dever', 'cartão', 'cartao']):
            return self.knowledge_base['debt_management']['recommendation']
        
        elif any(word in question_lower for word in ['investir', 'investimento', 'aplicar', 'render']):
            response = self.knowledge_base['investment_basics']['recommendation']
            if user_analysis and user_analysis['balance'] > 0:
                response += f" Você tem R$ {user_analysis['balance']:.2f} de saldo positivo que poderia ser investido."
            return response
        
        elif any(word in question_lower for word in ['orçamento', 'orcamento', 'controlar', 'gastar']):
            response = self.knowledge_base['budgeting']['recommendation']
            if user_analysis:
                response += f" Seus gastos atuais são de R$ {user_analysis['total_expense']:.2f} nos últimos 3 meses."
            return response
        
        elif any(word in question_lower for word in ['economizar', 'poupar', 'guardar']):
            response = "Para economizar, analise seus gastos e identifique onde pode cortar. Comece com pequenas mudanças."
            if user_analysis and user_analysis['expense_by_category']:
                highest_category = max(user_analysis['expense_by_category'], key=user_analysis['expense_by_category'].get)
                response += f" Sua maior categoria de gastos é '{highest_category}', talvez seja um bom lugar para começar."
            return response
        
        elif any(word in question_lower for word in ['meta', 'objetivo', 'sonho']):
            return "Definir metas financeiras é essencial! Seja específico, defina prazos e acompanhe o progresso regularmente."
        
        else:
            return "Desculpe, não entendi sua pergunta. Posso ajudar com temas como: reserva de emergência, investimentos, orçamento, dívidas, economia e metas financeiras."

@ai_advisor_bp.route('/ai-advisor/chat', methods=['POST'])
def chat_with_advisor():
    """Conversar com o assessor financeiro IA"""
    try:
        data = request.get_json()
        
        if 'question' not in data:
            return jsonify({'error': 'question é obrigatório'}), 400
        
        question = data['question']
        user_id = data.get('user_id')
        
        # Inicializar o assessor
        advisor = FinancialAdvisor()
        
        # Obter resposta
        response = advisor.answer_question(question, user_id)
        
        return jsonify({
            'question': question,
            'response': response,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_advisor_bp.route('/ai-advisor/insights', methods=['GET'])
def get_financial_insights():
    """Obter insights financeiros personalizados"""
    try:
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        # Inicializar o assessor
        advisor = FinancialAdvisor()
        
        # Analisar finanças do usuário
        user_analysis = advisor.analyze_user_finances(user_id)
        
        # Gerar insights
        insights = advisor.generate_insights(user_analysis)
        
        return jsonify({
            'insights': insights,
            'analysis': user_analysis,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_advisor_bp.route('/ai-advisor/suggestions', methods=['GET'])
def get_suggestions():
    """Obter sugestões de economia e otimização"""
    try:
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        # Inicializar o assessor
        advisor = FinancialAdvisor()
        
        # Analisar finanças do usuário
        user_analysis = advisor.analyze_user_finances(user_id)
        
        suggestions = []
        
        if not user_analysis:
            return jsonify({
                'suggestions': ['Adicione algumas transações para receber sugestões personalizadas.']
            }), 200
        
        # Sugestões baseadas na análise
        if user_analysis['expense_by_category']:
            # Sugestão para maior categoria de gastos
            highest_category = max(user_analysis['expense_by_category'], key=user_analysis['expense_by_category'].get)
            highest_amount = user_analysis['expense_by_category'][highest_category]
            
            if highest_amount > user_analysis['total_income'] * 0.3:  # Mais de 30% da renda
                suggestions.append({
                    'type': 'expense_reduction',
                    'category': highest_category,
                    'message': f"Você gasta R$ {highest_amount:.2f} em '{highest_category}'. Considere reduzir em 10-20%.",
                    'potential_saving': highest_amount * 0.15
                })
        
        # Sugestão de reserva de emergência
        if user_analysis['balance'] > 0:
            emergency_fund_target = user_analysis['total_expense'] * 0.5  # 6 meses de gastos
            suggestions.append({
                'type': 'emergency_fund',
                'message': f"Considere criar uma reserva de emergência de R$ {emergency_fund_target:.2f}.",
                'target_amount': emergency_fund_target
            })
        
        # Sugestão de investimento
        if user_analysis['balance'] > user_analysis['total_expense'] * 0.1:  # Sobra mais de 10%
            suggestions.append({
                'type': 'investment',
                'message': "Você tem um bom saldo positivo. Considere investir parte em Tesouro Direto ou CDBs.",
                'recommended_amount': user_analysis['balance'] * 0.7
            })
        
        return jsonify({
            'suggestions': suggestions,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_advisor_bp.route('/ai-advisor/budget-analysis', methods=['GET'])
def analyze_budget_performance():
    """Analisar performance dos orçamentos"""
    try:
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        # Obter orçamentos ativos
        active_budgets = Budget.query.filter_by(user_id=user_id, is_active=True).all()
        
        budget_analysis = []
        
        for budget in active_budgets:
            # Calcular gastos no período do orçamento
            spent_amount = db.session.query(db.func.sum(Transaction.amount)).filter(
                Transaction.user_id == user_id,
                Transaction.category_id == budget.category_id,
                Transaction.transaction_type == 'expense',
                Transaction.date >= budget.start_date,
                Transaction.date <= budget.end_date
            ).scalar() or 0
            
            usage_percentage = (spent_amount / budget.amount * 100) if budget.amount > 0 else 0
            
            # Gerar análise
            if usage_percentage > 100:
                status = 'exceeded'
                message = f"⚠️ Orçamento de '{budget.category.name}' ultrapassado em {usage_percentage - 100:.1f}%"
            elif usage_percentage > 80:
                status = 'warning'
                message = f"⚡ Orçamento de '{budget.category.name}' quase no limite ({usage_percentage:.1f}%)"
            else:
                status = 'good'
                message = f"✅ Orçamento de '{budget.category.name}' sob controle ({usage_percentage:.1f}%)"
            
            budget_analysis.append({
                'budget_id': budget.id,
                'budget_name': budget.name,
                'category_name': budget.category.name,
                'budget_amount': budget.amount,
                'spent_amount': spent_amount,
                'usage_percentage': round(usage_percentage, 2),
                'status': status,
                'message': message
            })
        
        return jsonify({
            'budget_analysis': budget_analysis,
            'total_budgets': len(active_budgets),
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

