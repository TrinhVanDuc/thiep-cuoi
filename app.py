# from flask import Flask, render_template, request, redirect, url_for, session
# import json
#
# from config import WEDDING, ADMIN_PASSWORD
#
#
# # ==========================================
# # KHỞI TẠO FLASK
# # ==========================================
#
# app = Flask(__name__)
#
# app.secret_key = "wedding-secret-key-2026"
#
#
# # ==========================================
# # TRANG CHỦ
# # ==========================================
#
# @app.route("/")
# def home():
#
#     return render_template(
#         "index.html",
#         wedding=WEDDING
#     )
#
#
# # ==========================================
# # TRANG RSVP
# # ==========================================
#
# @app.route("/rsvp", methods=["GET", "POST"])
# def rsvp():
#
#     if request.method == "POST":
#
#         name = request.form.get("name", "").strip()
#         attendance = request.form.get("attendance", "").strip()
#         message = request.form.get("message", "").strip()
#
#         guest = {
#             "name": name,
#             "attendance": attendance,
#             "message": message
#         }
#
#         with open(
#             "data/guests.json",
#             "r",
#             encoding="utf-8"
#         ) as file:
#
#             guests = json.load(file)
#
#         guests.append(guest)
#
#         with open(
#             "data/guests.json",
#             "w",
#             encoding="utf-8"
#         ) as file:
#
#             json.dump(
#                 guests,
#                 file,
#                 ensure_ascii=False,
#                 indent=4
#             )
#
#         return render_template(
#             "rsvp.html",
#             wedding=WEDDING,
#             success=True
#         )
#
#     return render_template(
#         "rsvp.html",
#         wedding=WEDDING
#     )
#
# # ==========================================
# # ĐĂNG NHẬP QUẢN TRỊ
# # ==========================================
#
# @app.route("/admin/login", methods=["GET", "POST"])
# def admin_login():
#
#     if request.method == "POST":
#
#         password = request.form.get("password", "")
#
#         if password == ADMIN_PASSWORD:
#
#             session["admin_logged_in"] = True
#
#             return redirect(
#                 url_for("admin")
#             )
#
#         return render_template(
#             "admin_login.html",
#             wedding=WEDDING,
#             error=True
#         )
#
#     return render_template(
#         "admin_login.html",
#         wedding=WEDDING,
#         error=False
#     )
#
# # ==========================================
# # ĐĂNG XUẤT QUẢN TRỊ
# # ==========================================
#
# @app.route("/admin/logout")
# def admin_logout():
#
#     session.pop(
#         "admin_logged_in",
#         None
#     )
#
#     return redirect(
#         url_for("admin_login")
#     )
#
# # ==========================================
# # TRANG QUẢN LÝ KHÁCH MỜI
# # ==========================================
#
# @app.route("/admin")
# def admin():
#
#     if not session.get("admin_logged_in"):
#
#         return redirect(
#             url_for("admin_login")
#         )
#
#     with open(
#         "data/guests.json",
#         "r",
#         encoding="utf-8"
#     ) as file:
#
#         guests = json.load(file)
#         total_guests = len(guests)
#
#         attending = sum(
#             1
#             for guest in guests
#             if guest.get("attendance") == "yes"
#         )
#
#         not_attending = sum(
#             1
#             for guest in guests
#             if guest.get("attendance") == "no"
#         )
#
#     return render_template(
#         "admin.html",
#         wedding=WEDDING,
#         guests=guests,
#         total_guests=total_guests,
#         attending=attending,
#         not_attending=not_attending
#     )
#
# # ==========================================
# # CHẠY WEBSITE
# # ==========================================
#
# if __name__ == "__main__":
#     app.run(debug=True)

import json
import os
from flask import Flask, render_template, request, redirect, url_for, session
from config import WEDDING, ADMIN_PASSWORD

app = Flask(__name__)
app.secret_key = "wedding-secret-key-2026"

DATA_FILE = os.path.join(app.root_path, "data", "guests.json")


# Hàm trợ giúp đọc/ghi file JSON an toàn
def get_guests():
    if not os.path.exists(DATA_FILE):
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def save_guest(guest_data):
    guests = get_guests()
    guests.append(guest_data)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(guests, f, ensure_ascii=False, indent=4)


# ==========================================
# ROUTES
# ==========================================

@app.route("/")
def home():
    return render_template("index.html", wedding=WEDDING)


@app.route("/rsvp", methods=["GET", "POST"])
def rsvp():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        attendance = request.form.get("attendance", "").strip()
        message = request.form.get("message", "").strip()

        if name:
            guest = {
                "name": name,
                "attendance": attendance,
                "message": message
            }
            save_guest(guest)

        return render_template("rsvp.html", wedding=WEDDING, success=True)

    return render_template("rsvp.html", wedding=WEDDING)


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        password = request.form.get("password", "")
        if password == ADMIN_PASSWORD:
            session["admin_logged_in"] = True
            return redirect(url_for("admin"))

        return render_template("admin_login.html", wedding=WEDDING, error=True)

    return render_template("admin_login.html", wedding=WEDDING, error=False)


@app.route("/admin/logout")
def admin_logout():
    session.pop("admin_logged_in", None)
    return redirect(url_for("admin_login"))


@app.route("/admin")
def admin():
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin_login"))

    guests = get_guests()
    total_guests = len(guests)
    attending = sum(1 for guest in guests if guest.get("attendance") == "yes")
    not_attending = sum(1 for guest in guests if guest.get("attendance") == "no")

    return render_template(
        "admin.html",
        wedding=WEDDING,
        guests=guests,
        total_guests=total_guests,
        attending=attending,
        not_attending=not_attending
    )


if __name__ == "__main__":
    app.run(debug=True)