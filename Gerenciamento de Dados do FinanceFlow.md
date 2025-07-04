# Gerenciamento de Dados do FinanceFlow

Este documento explica como gerenciar os dados do seu aplicativo FinanceFlow, incluindo banco de dados, backup, migração e escalabilidade.

## 🗄️ Banco de Dados Atual

Atualmente, o aplicativo usa **SQLite** como banco de dados, que é adequado para desenvolvimento e pequenas aplicações. O arquivo do banco está localizado em:

```
backend_flask/instance/database.db
```

### Estrutura das Tabelas

O aplicativo possui as seguintes tabelas principais:

1. **users** - Dados dos usuários
   - id, username, email, password_hash, created_at

2. **transactions** - Transações financeiras
   - id, user_id, description, amount, type, category_id, date, created_at

3. **categories** - Categorias de transações
   - id, name, type, color, icon, created_at

4. **budgets** - Orçamentos por categoria
   - id, user_id, category_id, amount, period, start_date, end_date, created_at

5. **goals** - Metas financeiras
   - id, user_id, name, target_amount, current_amount, target_date, created_at

## 📊 Visualizando e Editando Dados

### 1. Via Interface Web (Recomendado para usuários finais)

O próprio aplicativo FinanceFlow fornece interfaces para gerenciar dados:

- **Dashboard**: Visualização geral dos dados
- **Transações**: Adicionar, editar e excluir transações
- **Categorias**: Gerenciar categorias
- **Orçamentos**: Definir e acompanhar orçamentos
- **Metas**: Criar e monitorar metas financeiras

### 2. Via Banco de Dados Diretamente (Para administradores)

Para acessar diretamente o banco SQLite:

```bash
# Instalar sqlite3 (se não estiver instalado)
sudo apt-get install sqlite3

# Acessar o banco de dados
cd /home/ubuntu/fintech_saas_app/backend_flask/backend_flask
sqlite3 instance/database.db

# Comandos úteis no SQLite:
.tables                    # Listar todas as tabelas
.schema users             # Ver estrutura da tabela users
SELECT * FROM users;      # Ver todos os usuários
SELECT * FROM transactions LIMIT 10;  # Ver 10 transações
.quit                     # Sair do SQLite
```

### 3. Via API REST

Você pode usar as APIs do backend para gerenciar dados programaticamente:

```bash
# Exemplo: Listar usuários
curl -X GET https://seu-dominio.com/api/users

# Exemplo: Criar nova transação
curl -X POST https://seu-dominio.com/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "description": "Compra no supermercado",
    "amount": -150.00,
    "type": "expense",
    "category_id": 1
  }'
```

## 🔄 Backup e Restauração

### Backup do SQLite

```bash
# Backup simples (cópia do arquivo)
cp /home/ubuntu/fintech_saas_app/backend_flask/backend_flask/instance/database.db \
   /home/ubuntu/backup_database_$(date +%Y%m%d_%H%M%S).db

# Backup com dump SQL
sqlite3 /home/ubuntu/fintech_saas_app/backend_flask/backend_flask/instance/database.db \
  .dump > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauração

```bash
# Restaurar do arquivo de backup
cp /home/ubuntu/backup_database_20241204_120000.db \
   /home/ubuntu/fintech_saas_app/backend_flask/backend_flask/instance/database.db

# Restaurar do dump SQL
sqlite3 /home/ubuntu/fintech_saas_app/backend_flask/backend_flask/instance/database.db \
  < backup_20241204_120000.sql
```

## 📈 Migrando para Banco de Dados de Produção

Para uma aplicação comercial, recomenda-se migrar do SQLite para um banco mais robusto:

### 1. PostgreSQL (Recomendado)

**Vantagens:**
- Excelente performance
- Suporte a transações ACID
- Escalabilidade
- Recursos avançados (JSON, arrays, etc.)

**Configuração:**

1. Instalar dependências:
```bash
pip install psycopg2-binary
```

2. Alterar `src/main.py`:
```python
# Substituir a linha de configuração do banco
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://usuario:senha@localhost/financeflow'
```

3. Criar banco PostgreSQL:
```sql
CREATE DATABASE financeflow;
CREATE USER financeflow_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE financeflow TO financeflow_user;
```

### 2. MySQL/MariaDB

**Configuração:**

1. Instalar dependências:
```bash
pip install PyMySQL
```

2. Alterar `src/main.py`:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://usuario:senha@localhost/financeflow'
```

### 3. Serviços de Banco em Nuvem

Para facilitar o gerenciamento, considere usar:

- **AWS RDS** (PostgreSQL/MySQL)
- **Google Cloud SQL**
- **Azure Database**
- **PlanetScale** (MySQL serverless)
- **Supabase** (PostgreSQL com interface web)

## 🔧 Migrações de Banco de Dados

Para gerenciar mudanças na estrutura do banco sem perder dados:

### 1. Instalar Flask-Migrate

```bash
pip install Flask-Migrate
```

### 2. Configurar no `src/main.py`

```python
from flask_migrate import Migrate

# Após criar a instância do app e db
migrate = Migrate(app, db)
```

### 3. Comandos de Migração

```bash
# Inicializar migrações
flask db init

# Criar uma nova migração
flask db migrate -m "Adicionar campo email_verified na tabela users"

# Aplicar migrações
flask db upgrade

# Reverter migração
flask db downgrade
```

## 📊 Monitoramento e Analytics

### 1. Logs de Aplicação

Adicionar logging ao Flask:

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/financeflow.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
```

### 2. Métricas de Uso

Implementar tracking de:
- Número de usuários ativos
- Transações criadas por dia
- Funcionalidades mais usadas
- Performance das APIs

### 3. Ferramentas de Monitoramento

- **Sentry**: Para tracking de erros
- **New Relic**: Para performance monitoring
- **Google Analytics**: Para analytics do frontend
- **Mixpanel**: Para analytics de produto

## 🔐 Segurança dos Dados

### 1. Criptografia

- **Senhas**: Já implementado com hash bcrypt
- **Dados sensíveis**: Considere criptografar dados financeiros sensíveis
- **Conexão**: Use HTTPS sempre (SSL/TLS)

### 2. Backup Seguro

```bash
# Backup criptografado
sqlite3 database.db .dump | gpg --cipher-algo AES256 --compress-algo 1 \
  --symmetric --output backup_encrypted.sql.gpg
```

### 3. Controle de Acesso

- Implementar autenticação JWT
- Rate limiting nas APIs
- Validação rigorosa de inputs
- Logs de auditoria

## 📱 Dados de Demonstração

O aplicativo vem com dados de exemplo. Para produção:

### 1. Remover Dados de Demo

```sql
-- Conectar ao banco e executar:
DELETE FROM transactions WHERE user_id = 1;
DELETE FROM budgets WHERE user_id = 1;
DELETE FROM goals WHERE user_id = 1;
-- Manter categorias padrão, mas remover dados específicos do usuário demo
```

### 2. Configurar Dados Iniciais

Criar script para popular categorias padrão:

```python
# src/scripts/init_data.py
def create_default_categories():
    categories = [
        {'name': 'Alimentação', 'type': 'expense', 'color': '#FF6B6B', 'icon': 'utensils'},
        {'name': 'Transporte', 'type': 'expense', 'color': '#4ECDC4', 'icon': 'car'},
        {'name': 'Lazer', 'type': 'expense', 'color': '#45B7D1', 'icon': 'gamepad'},
        {'name': 'Salário', 'type': 'income', 'color': '#96CEB4', 'icon': 'dollar-sign'},
        # ... mais categorias
    ]
    
    for cat_data in categories:
        category = Category(**cat_data)
        db.session.add(category)
    
    db.session.commit()
```

Com essas informações, você tem controle total sobre os dados do seu aplicativo FinanceFlow!

