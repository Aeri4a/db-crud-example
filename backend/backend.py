from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import text
from flask_cors import CORS

# APP INIT



class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__)
CORS(app, origins='*', methods=["GET", "POST", "PATCH", "DELETE"], resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:pass@localhost:5432/postgres"
db.init_app(app)

class Student(db.Model):
    index: Mapped[int] = mapped_column(primary_key=True)
    grade: Mapped[float]
    def as_dict(self):
        return {"index":self.index,"grade":self.grade}

with app.app_context():
    db.create_all()

# DB ENDPOINTS

@app.route("/students/all", methods=["GET"])
def student_read_all():
    students = db.session.execute(db.select(Student).order_by(Student.index)).scalars()
    return jsonify([student.as_dict() for student in students.fetchall()])

@app.route("/students/<int:index>", methods=["GET"])
def student_read(index):
    student = db.get_or_404(Student, index)
    return jsonify([student.as_dict()])

@app.route("/students", methods=["POST"])
def student_create():
    student = Student(
        index=request.json["index"],
        grade=request.json["grade"],
    )
    db.session.add(student)
    db.session.commit()
    return "", 201

@app.route("/students/<int:index>", methods=["PATCH"])
def student_update(index):
    student = db.get_or_404(Student, index)
    student.grade = request.json["grade"]
    db.session.commit()
    return "", 204

@app.route("/students/<int:index>", methods=["DELETE"])
def student_delete(index):
    student = db.get_or_404(Student, index)
    db.session.delete(student)
    db.session.commit()
    return "", 204

# NOT SAFE
@app.route("/raw/<string:index>", methods=["GET"])
def student_raw_read(index):
    query = f"SELECT * FROM STUDENT WHERE INDEX = {index}"
    students = db.session.execute(text(query))
    return jsonify([{"index":student.index,"grade":student.grade} for student in students.fetchall()])

app.run()