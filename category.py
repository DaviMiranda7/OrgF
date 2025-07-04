from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    color = db.Column(db.String(7), nullable=True)  # Hex color code
    icon = db.Column(db.String(50), nullable=True)  # Icon name
    category_type = db.Column(db.String(20), nullable=False)  # 'income' or 'expense'
    is_default = db.Column(db.Boolean, default=False)  # Categorias padrão do sistema
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Null para categorias padrão
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    user = db.relationship('User', backref=db.backref('categories', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color,
            'icon': self.icon,
            'category_type': self.category_type,
            'is_default': self.is_default,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

