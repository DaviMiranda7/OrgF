# Deploy para Produção - FinanceFlow

Este documento apresenta as melhores estratégias para colocar seu aplicativo FinanceFlow no ar de forma profissional e escalável.

## 🚀 Opções de Deploy

### 1. **Vercel + PlanetScale** (Recomendado para Iniciantes)

**Vantagens:**
- Deploy automático via Git
- Escalabilidade automática
- SSL gratuito
- Banco de dados gerenciado
- Custo baixo para começar

**Configuração:**

1. **Frontend (Vercel):**
```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório do frontend
cd frontend_react
vercel

# Configurar variáveis de ambiente
vercel env add VITE_API_URL production
# Valor: https://seu-backend.vercel.app
```

2. **Backend (Vercel):**
```bash
# No diretório do backend
cd backend_flask
vercel

# Configurar variáveis de ambiente
vercel env add DATABASE_URL production
# Valor: sua string de conexão do PlanetScale
```

3. **Banco (PlanetScale):**
- Criar conta em planetscale.com
- Criar database "financeflow"
- Obter string de conexão
- Atualizar `src/main.py` para usar `DATABASE_URL`

### 2. **Heroku** (Simples e Confiável)

**Vantagens:**
- Fácil de usar
- Add-ons para banco, Redis, etc.
- Logs centralizados
- Escalabilidade manual

**Configuração:**

1. **Instalar Heroku CLI:**
```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Preparar aplicação:**
```bash
# Criar Procfile na raiz do backend
echo "web: python -m src.main" > Procfile

# Criar requirements.txt
pip freeze > requirements.txt

# Criar runtime.txt
echo "python-3.11.0" > runtime.txt
```

3. **Deploy:**
```bash
# Login no Heroku
heroku login

# Criar app
heroku create financeflow-app

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 3. **DigitalOcean App Platform** (Equilibrio Preço/Performance)

**Vantagens:**
- Preços competitivos
- Banco PostgreSQL gerenciado
- Fácil escalabilidade
- Boa documentação

**Configuração:**

1. **Conectar repositório Git**
2. **Configurar build settings:**
   - Build Command: `cd frontend_react && npm run build`
   - Run Command: `cd backend_flask && python -m src.main`
3. **Adicionar banco PostgreSQL**
4. **Configurar variáveis de ambiente**

### 4. **AWS (Para Aplicações Grandes)**

**Vantagens:**
- Máxima escalabilidade
- Muitos serviços integrados
- Controle total da infraestrutura

**Serviços recomendados:**
- **Frontend**: S3 + CloudFront
- **Backend**: Elastic Beanstalk ou ECS
- **Banco**: RDS PostgreSQL
- **CDN**: CloudFront
- **DNS**: Route 53

### 5. **Google Cloud Platform**

**Vantagens:**
- Créditos gratuitos para novos usuários
- Cloud Run para containers
- Firestore para NoSQL

**Serviços recomendados:**
- **Frontend**: Firebase Hosting
- **Backend**: Cloud Run
- **Banco**: Cloud SQL PostgreSQL

## 🔧 Configuração para Produção

### 1. Variáveis de Ambiente

Criar arquivo `.env` para produção:

```bash
# Backend (.env)
FLASK_ENV=production
SECRET_KEY=sua_chave_secreta_muito_segura_aqui
DATABASE_URL=postgresql://user:pass@host:port/dbname
CORS_ORIGINS=https://seu-frontend.com
JWT_SECRET_KEY=outra_chave_secreta_para_jwt
```

```bash
# Frontend (.env.production)
VITE_API_URL=https://seu-backend.com
VITE_APP_NAME=FinanceFlow
```

### 2. Configuração de Segurança

Atualizar `src/main.py`:

```python
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configurações de produção
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# CORS configurado para produção
CORS(app, origins=os.environ.get('CORS_ORIGINS', '').split(','))

# Configurações de segurança
if not app.debug:
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
```

### 3. Otimizações de Performance

**Backend:**
```python
# Adicionar cache Redis
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})

@app.route('/api/dashboard')
@cache.cached(timeout=300)  # Cache por 5 minutos
def dashboard():
    # ... código do dashboard
```

**Frontend:**
```bash
# Build otimizado
npm run build

# Análise do bundle
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/js/*.js
```

## 🌐 Domínio Personalizado

### 1. Registrar Domínio

Recomendações de registradores:
- **Namecheap** (bom custo-benefício)
- **Google Domains** (integração com Google)
- **Cloudflare** (DNS gratuito)

### 2. Configurar DNS

Exemplo para Vercel:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 3. SSL/HTTPS

A maioria das plataformas oferece SSL gratuito:
- Vercel: Automático
- Heroku: Automático no plano pago
- Cloudflare: Gratuito

## 📊 Monitoramento em Produção

### 1. Logs

**Heroku:**
```bash
heroku logs --tail
```

**Vercel:**
- Dashboard web com logs em tempo real

### 2. Uptime Monitoring

Ferramentas gratuitas:
- **UptimeRobot**: Monitora se o site está no ar
- **Pingdom**: Monitoramento de performance
- **StatusCake**: Alertas por email/SMS

### 3. Error Tracking

**Sentry** (Recomendado):
```bash
pip install sentry-sdk[flask]
```

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="sua_dsn_do_sentry",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

## 🔄 CI/CD (Deploy Automático)

### GitHub Actions

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Build Frontend
      run: |
        cd frontend_react
        npm install
        npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 💰 Estimativa de Custos

### Opção 1: Vercel + PlanetScale
- **Frontend (Vercel)**: $0-20/mês
- **Backend (Vercel)**: $0-20/mês  
- **Banco (PlanetScale)**: $0-39/mês
- **Total**: $0-79/mês

### Opção 2: Heroku
- **App (Heroku)**: $7-25/mês
- **Banco PostgreSQL**: $9-50/mês
- **Total**: $16-75/mês

### Opção 3: DigitalOcean
- **App Platform**: $5-12/mês
- **Banco PostgreSQL**: $15-40/mês
- **Total**: $20-52/mês

## 🚀 Checklist de Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Migrar para banco PostgreSQL
- [ ] Configurar CORS para domínio de produção
- [ ] Ativar HTTPS/SSL
- [ ] Configurar monitoramento de erros
- [ ] Testar todas as funcionalidades
- [ ] Configurar backup automático do banco
- [ ] Configurar domínio personalizado
- [ ] Configurar analytics (Google Analytics)
- [ ] Documentar processo de deploy
- [ ] Configurar alertas de uptime

## 🔧 Troubleshooting Comum

### Erro de CORS
```python
# Verificar configuração no backend
CORS(app, origins=['https://seu-dominio.com'])
```

### Erro de Banco de Dados
```python
# Verificar string de conexão
print(app.config['SQLALCHEMY_DATABASE_URI'])
```

### Build do Frontend Falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

Com essas estratégias, você pode escolher a melhor opção para colocar seu FinanceFlow no ar de forma profissional!

