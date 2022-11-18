from flask import *
from pool import pool
import urllib.error
import unicodedata
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.route("/api/attractions")
def getData():
	try:
		cnx = pool.get_connection()
		cnx2 = pool.get_connection()
		cursor = cnx.cursor(dictionary=True)
		cursor2 = cnx2.cursor()
		page = request.args.get("page")
		page = int(page)
		start = page * 12
		get_num = 12
		page_num = page + 1
		keyword = request.args.get("keyword")
		if keyword == None:
			cursor2.execute("""SELECT COUNT(`id`) FROM `taipei`""")
			data_num = cursor2.fetchone()   #後續看看會不會跟後面的cursor2打架
			if (page_num*12) > data_num[0]:
				get_num = data_num[0] - start
				page_num = None
			cursor.execute("""SELECT `att_id`, `name`, `category`, `address`, `mrt`, `lat`, `lng`, `transport`, 
			`description` FROM `taipei` ORDER BY `att_id` LIMIT %s,%s""", (start, get_num))
			page_data = cursor.fetchall()
		else:
			cursor2.execute("""SELECT COUNT(`att_id`) FROM `taipei` WHERE `category` = %s OR `name` LIKE %s""",(keyword, '%'+keyword+'%'))
			data_num = cursor2.fetchone()
			if (page_num*12) > data_num[0]:
				get_num = data_num[0] - start
				page_num = None
			cursor.execute("""SELECT `att_id`, `name`, `category`, `address`, `mrt`, `lat`, `lng`, `transport`, 
			`description` FROM `taipei` WHERE `category` = %s OR `name` LIKE %s LIMIT %s,%s""",(keyword, '%'+keyword+'%', start, get_num)) 
			page_data = cursor.fetchall()
		for d in page_data:
				cursor2.execute("""SELECT `img_url` FROM `att_image` WHERE `att_id`= %s""", (d["att_id"],))
				url_tuple = cursor2.fetchall()
				url_list = []
				for url_item in url_tuple:
					url_list += list(url_item)
				d["image"] = url_list
		return jsonify(nextPage=page_num,data=page_data)
	except:
		return jsonify(error = True, message = "伺服器內部錯誤"),500
	finally:
		cursor.close()
		cursor2.close()
		cnx.close()
		cnx2.close()

@app.route("/api/attraction/<attractionId>")
def getData_by_Id(attractionId):
	cnx = pool.get_connection()
	cursor = cnx.cursor(dictionary=True)
	cnx2 = pool.get_connection()
	cursor2 = cnx2.cursor()
	try:
		cursor.execute("""SELECT `att_id`, `name`, `category`, `address`, `mrt`, `lat`, `lng`,
			`transport`, `description` FROM `taipei` WHERE `att_id` = %s""", (attractionId,))
		page_data = cursor.fetchall()
		if page_data == []:
			return jsonify(error = True, message = "景點編號不正確"),400
		cursor2.execute("""SELECT `img_url` FROM `att_image` WHERE `att_id`= %s""", (page_data[0]["att_id"],))
		
		url_tuple = cursor2.fetchall()
		url_list = []
		for url_item in url_tuple:
			url_list += list(url_item)
		page_data[0]["image"] = url_list
		return jsonify(data = page_data)

	except:
		return jsonify(error = True, message = "伺服器內部錯誤"),500

	finally:
		cursor.close()
		cursor2.close()
		cnx.close()
		cnx2.close()

@app.route("/api/categories")
def getCat():
	cnx = pool.get_connection()
	cursor = cnx.cursor()
	try:
		cursor.execute("""SELECT `category` from `taipei` GROUP BY `category`""")
		page_data = cursor.fetchall()
		cat_list = []
		for d in page_data:
			cat_list.append(d[0])
		normalized_cat_list = [unicodedata.normalize("NFKC", line) for line in cat_list]
		return jsonify(data = normalized_cat_list)
	except:
		return jsonify(error = True, message = "伺服器內部錯誤"),500
	finally:
		cursor.close()
		cnx.close()
app.run(port=3000)