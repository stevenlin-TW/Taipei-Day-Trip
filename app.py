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
	#try:
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
	print(keyword)
	if keyword == None:
		cursor2.execute("""SELECT COUNT(`id`) FROM `taipei`""")
		data_num = cursor2.fetchone()   #後續看看會不會跟後面的cursor2打架
		if (page_num*12) > data_num[0]:
			get_num = data_num[0] - start
			page_num = None
		cursor.execute("""SET session group_concat_max_len = 15000""")
		cursor.execute("""SELECT `taipei`.`id`, ANY_VALUE(`taipei`.`name`) as name, 
						ANY_VALUE(`taipei`.`category`) as category, ANY_VALUE(`taipei`.`address`) as address, 
						ANY_VALUE(`taipei`.`mrt`) as mrt, ANY_VALUE(`taipei`.`lat`) as lat, 
						ANY_VALUE(`taipei`.`lng`) as lng, ANY_VALUE(`taipei`.`transport`) as transport,
						ANY_VALUE(`taipei`.`description`) as description, GROUP_CONCAT(DISTINCT `att_image`.`image` SEPARATOR ',') as image
						FROM `taipei` INNER JOIN `att_image` ON `taipei`.`id` = `att_image`.`att_id` 
						GROUP BY `taipei`.`id` ORDER BY `taipei`.`id` LIMIT %s,%s""", (start, get_num))
		page_data = cursor.fetchall()
		for data in page_data:
			data['image'] = data['image'].split(',')
			#data['image'] = content
	else:
		cursor2.execute("""SELECT COUNT(`id`) FROM `taipei` WHERE `category` = %s OR `name` LIKE %s""",(keyword, '%'+keyword+'%'))
		data_num = cursor2.fetchone()
		if (page_num*12) > data_num[0]:
			get_num = data_num[0] - start
			page_num = None
		cursor.execute("""SET session group_concat_max_len = 60000""")
		cursor.execute("""SELECT `taipei`.`id`, ANY_VALUE(`taipei`.`name`) as name, 
						ANY_VALUE(`taipei`.`category`) as category, ANY_VALUE(`taipei`.`address`) as address, 
						ANY_VALUE(`taipei`.`mrt`) as mrt, ANY_VALUE(`taipei`.`lat`) as lat, 
						ANY_VALUE(`taipei`.`lng`) as lng, ANY_VALUE(`taipei`.`transport`) as transport,
						ANY_VALUE(`taipei`.`description`) as description, GROUP_CONCAT(DISTINCT `att_image`.`image` SEPARATOR ',') as image 
						FROM `taipei` INNER JOIN `att_image` ON `taipei`.`id` = `att_image`.`att_id` WHERE `taipei`.`category` = %s OR `taipei`.`name` LIKE %s GROUP BY `taipei`.`id` LIMIT %s,%s""", (keyword, '%'+keyword+'%', start, get_num)) 
		page_data = cursor.fetchall()
		for data in page_data:
			data['image'] = data['image'].split(',')
			#data['image'] = content
	
	# except:
	# 	return jsonify(error = True, message = "伺服器內部錯誤"),500
	# finally:
	cursor.close()
	cursor2.close()
	cnx.close()
	cnx2.close()

	return jsonify(nextPage=page_num,data=page_data)

@app.route("/api/attraction/<attractionId>")
def getData_by_Id(attractionId):
	cnx = pool.get_connection()
	cursor = cnx.cursor(dictionary=True)
	cnx2 = pool.get_connection()
	cursor2 = cnx2.cursor()
	try:
		cursor.execute("""SET session group_concat_max_len = 15000""")
		cursor.execute("""SELECT `taipei`.`id`, ANY_VALUE(`taipei`.`name`) as name, 
						ANY_VALUE(`taipei`.`category`) as category, ANY_VALUE(`taipei`.`address`) as address, 
						ANY_VALUE(`taipei`.`mrt`) as mrt, ANY_VALUE(`taipei`.`lat`) as lat, 
						ANY_VALUE(`taipei`.`lng`) as lng, ANY_VALUE(`taipei`.`transport`) as transport,
						ANY_VALUE(`taipei`.`description`) as description, GROUP_CONCAT(DISTINCT `att_image`.`image` SEPARATOR ',') as image
						FROM `taipei` INNER JOIN `att_image` ON `taipei`.`id` = `att_image`.`att_id` 
						GROUP BY `taipei`.`id`""") 
		all_data = cursor.fetchall()
		page_data = None
		for data in all_data:
			if data['id'] == int(attractionId):
				page_data = data
				page_data['image'] = page_data['image'].split(',')
			
		if page_data == None:
			return jsonify(error = True, message = "景點編號不正確"),400
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
app.run(port=3000, host="0.0.0.0")