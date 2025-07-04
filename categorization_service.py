import re
from typing import Dict, List, Optional
from src.models.category import Category
from src.models.transaction import Transaction

class CategorizationService:
    """Serviço para categorização automatizada de transações"""
    
    def __init__(self):
        # Palavras-chave para categorização automática
        self.category_keywords = {
            'Alimentação': [
                'restaurante', 'lanchonete', 'padaria', 'supermercado', 'mercado',
                'ifood', 'uber eats', 'delivery', 'pizza', 'hamburguer', 'mcdonalds',
                'burger king', 'subway', 'starbucks', 'cafe', 'bar', 'boteco',
                'açougue', 'hortifruti', 'feira', 'comida', 'alimento'
            ],
            'Transporte': [
                'uber', 'taxi', 'posto', 'combustivel', 'gasolina', 'etanol',
                'onibus', 'metro', 'trem', 'passagem', 'estacionamento',
                'pedagio', 'mecanica', 'oficina', 'pneu', 'oleo', 'revisao'
            ],
            'Moradia': [
                'aluguel', 'condominio', 'iptu', 'energia', 'luz', 'agua',
                'gas', 'internet', 'telefone', 'limpeza', 'reforma',
                'material construcao', 'tinta', 'eletricista', 'encanador'
            ],
            'Saúde': [
                'farmacia', 'drogaria', 'medico', 'dentista', 'hospital',
                'clinica', 'laboratorio', 'exame', 'consulta', 'remedio',
                'medicamento', 'plano saude', 'convenio', 'fisioterapia'
            ],
            'Educação': [
                'escola', 'faculdade', 'universidade', 'curso', 'livro',
                'material escolar', 'mensalidade', 'matricula', 'aula',
                'professor', 'educacao', 'estudo'
            ],
            'Lazer': [
                'cinema', 'teatro', 'show', 'festa', 'balada', 'viagem',
                'hotel', 'pousada', 'turismo', 'parque', 'shopping',
                'jogo', 'netflix', 'spotify', 'streaming', 'academia',
                'esporte', 'ginasio'
            ],
            'Compras': [
                'loja', 'shopping', 'roupa', 'sapato', 'calcado', 'acessorio',
                'eletronico', 'celular', 'computador', 'notebook', 'tv',
                'geladeira', 'fogao', 'microondas', 'presente', 'gift'
            ],
            'Serviços': [
                'banco', 'cartorio', 'advogado', 'contador', 'seguro',
                'manutencao', 'conserto', 'lavanderia', 'cabeleireiro',
                'salao', 'barbeiro', 'estetica'
            ],
            'Salário': [
                'salario', 'ordenado', 'pagamento', 'empresa', 'trabalho',
                'pix salario', 'deposito salario', 'folha pagamento'
            ],
            'Freelance': [
                'freelance', 'freela', 'autonomo', 'servico prestado',
                'consultoria', 'projeto', 'trabalho extra'
            ],
            'Investimentos': [
                'dividendo', 'juros', 'rendimento', 'aplicacao', 'investimento',
                'cdb', 'tesouro', 'acao', 'fundo', 'poupanca'
            ],
            'Vendas': [
                'venda', 'vendeu', 'mercado livre', 'olx', 'marketplace',
                'comissao', 'produto vendido'
            ]
        }
    
    def normalize_text(self, text: str) -> str:
        """Normalizar texto para comparação"""
        if not text:
            return ""
        
        # Converter para minúsculas e remover acentos
        text = text.lower()
        text = re.sub(r'[áàâãä]', 'a', text)
        text = re.sub(r'[éèêë]', 'e', text)
        text = re.sub(r'[íìîï]', 'i', text)
        text = re.sub(r'[óòôõö]', 'o', text)
        text = re.sub(r'[úùûü]', 'u', text)
        text = re.sub(r'[ç]', 'c', text)
        
        # Remover caracteres especiais
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Remover espaços extras
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def categorize_transaction(self, description: str, amount: float, user_id: int) -> Optional[int]:
        """Categorizar uma transação baseada na descrição"""
        if not description:
            return None
        
        normalized_description = self.normalize_text(description)
        
        # Determinar se é receita ou despesa baseado no valor
        transaction_type = 'income' if amount > 0 else 'expense'
        
        # Buscar categorias disponíveis para o usuário
        available_categories = Category.query.filter(
            (Category.is_default == True) | (Category.user_id == user_id),
            Category.category_type == transaction_type
        ).all()
        
        # Criar mapeamento de nome para categoria
        category_map = {self.normalize_text(cat.name): cat for cat in available_categories}
        
        # Buscar por palavras-chave
        best_match = None
        max_score = 0
        
        for category_name, keywords in self.category_keywords.items():
            # Verificar se a categoria existe para o usuário
            normalized_category = self.normalize_text(category_name)
            if normalized_category not in category_map:
                continue
            
            # Calcular score baseado nas palavras-chave encontradas
            score = 0
            for keyword in keywords:
                normalized_keyword = self.normalize_text(keyword)
                if normalized_keyword in normalized_description:
                    # Dar mais peso para palavras-chave mais específicas
                    score += len(normalized_keyword)
            
            if score > max_score:
                max_score = score
                best_match = category_map[normalized_category]
        
        return best_match.id if best_match else None
    
    def suggest_categories(self, description: str, user_id: int, limit: int = 3) -> List[Dict]:
        """Sugerir múltiplas categorias para uma transação"""
        if not description:
            return []
        
        normalized_description = self.normalize_text(description)
        
        # Buscar todas as categorias disponíveis
        available_categories = Category.query.filter(
            (Category.is_default == True) | (Category.user_id == user_id)
        ).all()
        
        # Criar mapeamento de nome para categoria
        category_map = {self.normalize_text(cat.name): cat for cat in available_categories}
        
        # Calcular scores para todas as categorias
        category_scores = []
        
        for category_name, keywords in self.category_keywords.items():
            normalized_category = self.normalize_text(category_name)
            if normalized_category not in category_map:
                continue
            
            category = category_map[normalized_category]
            score = 0
            matched_keywords = []
            
            for keyword in keywords:
                normalized_keyword = self.normalize_text(keyword)
                if normalized_keyword in normalized_description:
                    score += len(normalized_keyword)
                    matched_keywords.append(keyword)
            
            if score > 0:
                category_scores.append({
                    'category_id': category.id,
                    'category_name': category.name,
                    'category_type': category.category_type,
                    'score': score,
                    'confidence': min(score / 10, 1.0),  # Normalizar para 0-1
                    'matched_keywords': matched_keywords
                })
        
        # Ordenar por score e retornar os melhores
        category_scores.sort(key=lambda x: x['score'], reverse=True)
        return category_scores[:limit]
    
    def create_categorization_rule(self, user_id: int, keyword: str, category_id: int) -> bool:
        """Criar uma regra personalizada de categorização"""
        # Esta funcionalidade pode ser expandida para salvar regras personalizadas
        # Por enquanto, apenas validamos se a categoria existe
        category = Category.query.filter(
            Category.id == category_id,
            (Category.is_default == True) | (Category.user_id == user_id)
        ).first()
        
        return category is not None
    
    def batch_categorize(self, user_id: int, limit: int = 100) -> Dict:
        """Categorizar em lote transações sem categoria"""
        # Buscar transações sem categoria
        uncategorized_transactions = Transaction.query.filter(
            Transaction.user_id == user_id,
            Transaction.category_id.is_(None)
        ).limit(limit).all()
        
        results = {
            'total_processed': 0,
            'categorized': 0,
            'uncategorized': 0,
            'details': []
        }
        
        for transaction in uncategorized_transactions:
            results['total_processed'] += 1
            
            # Tentar categorizar
            suggested_category_id = self.categorize_transaction(
                transaction.description,
                transaction.amount,
                user_id
            )
            
            if suggested_category_id:
                # Atualizar a transação
                transaction.category_id = suggested_category_id
                results['categorized'] += 1
                
                # Obter nome da categoria para o resultado
                category = Category.query.get(suggested_category_id)
                results['details'].append({
                    'transaction_id': transaction.id,
                    'description': transaction.description,
                    'suggested_category': category.name if category else 'Desconhecida',
                    'status': 'categorized'
                })
            else:
                results['uncategorized'] += 1
                results['details'].append({
                    'transaction_id': transaction.id,
                    'description': transaction.description,
                    'status': 'uncategorized'
                })
        
        return results

