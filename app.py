from flask import *
from pool import pool
import urllib.error
import unicodedata
import jwt
import time
import urllib.request as req
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
		cursor.execute("""SELECT `category` FROM `taipei` GROUP BY `category`""")
		page_data = cursor.fetchall()
		cat_list = []
		for d in page_data:
			cat_list.append(d[0])
		normalized_cat_list = [unicodedata.normalize("NFKC", line) for line in cat_list]
		return jsonify(data = normalized_cat_list),200
	except:
		return jsonify(error = True, message = "伺服器內部錯誤"),500
	finally:
		cursor.close()
		cnx.close()

@app.route("/api/user", methods=["POST"])
def SignUp():
	try:
		body = request.get_json()
		#print(body["password"])
		cnx = pool.get_connection()
		cursor = cnx.cursor()
		cursor.execute("""SELECT `id` FROM `member` WHERE `email` = %s""", (body["email"],))
		result = cursor.fetchall()
		if result != []:
			return jsonify(error = True, message = "註冊失敗，重複的 Email 或其他原因"),400
		cursor.execute("""INSERT INTO `member`(`name`, `email`, `password`) VALUES (%s, %s, %s)""", (body["name"], body["email"], body["password"]))
		cnx.commit()
		return jsonify(ok = True),200
	except:
		return jsonify(error = True, message = "伺服器內部錯誤"),500
	finally:
		cursor.close()
		cnx.close()

@app.route("/api/user/auth", methods=["GET", "PUT", "DELETE"])
def SingIn():
	if request.method == "PUT":
		try:
			body = request.get_json()
			cnx = pool.get_connection()
			cursor = cnx.cursor()
			cursor.execute("""SELECT `id`, `name`, `email` FROM `member` WHERE `email` = %s AND `password` = %s""", (body["email"], body["password"]))
			result = cursor.fetchall()
			if result == []:
				return jsonify(error = True, message = "登入失敗，帳號或密碼錯誤或其他原因"),400
			token = jwt.encode({"id" : result[0][0], "name" : result[0][1], "email" : result[0][2]}, "secret", algorithm="HS256")
			resp = make_response(jsonify(ok = True))
			resp.set_cookie("token", value=token, expires=time.time()+7*24*60*60)
			return resp, 200
		except:
			return jsonify(error = True, message = "伺服器內部錯誤"),500
		finally:
			cursor.close()
			cnx.close()
		
	elif request.method == "GET":
		try:
			token = request.cookies.get("token")
			if token != "":
				member_info = jwt.decode(token, "secret", algorithms=["HS256"])
				return jsonify(data = member_info)
			else:
				return jsonify(data = None)
		except:
			return jsonify(data = None)

	elif request.method == "DELETE":
		resp = make_response(jsonify(ok = True))
		resp.set_cookie(key="token", value="", expires=0)
		return resp
		
@app.route("/api/booking", methods=["GET", "POST", "DELETE"])
def bookSchedule():
	try:
		token = request.cookies.get("token")
		if token == None:
			return jsonify(error = True, message = "未登入系統，拒絕存取"),403
		else:
			if request.method == "POST":
				booking_info = request.get_json()
				member_info = jwt.decode(token, "secret", algorithms=["HS256"])
				cnx = pool.get_connection()
				cursor = cnx.cursor()
				cursor.execute("""SELECT `id` FROM `booking` WHERE `member_id` = %s""", (member_info["id"],))
				last_booking = cursor.fetchone()
				if last_booking != []:
					cursor.execute("""DELETE FROM `booking` WHERE `member_id` = %s""", (member_info["id"],))
					cnx.commit()
				cursor.execute("""INSERT INTO `booking`(`member_id`, `attraction_id`, `date`, `time`, `price`) VALUES(%s, %s, %s, %s, %s)""", (member_info["id"], int(booking_info["attractionId"]), booking_info["date"], booking_info["time"], booking_info["price"]))
				cnx.commit()
				return jsonify(ok = True)

			elif request.method == "GET":
				member_info = jwt.decode(token, "secret", algorithms=["HS256"])
				cnx = pool.get_connection()
				cursor = cnx.cursor(dictionary = True)
				cursor.execute("""SELECT `booking`.`attraction_id`, `taipei`.`name`, `taipei`.`address`, `att_image`.`image`, `booking`.`date`, `booking`.`time`, `booking`.`price` FROM ((`taipei` INNER JOIN `booking` ON `taipei`.`id` = `booking`.`attraction_id`) INNER JOIN `att_image` ON `taipei`.`id` = `att_image`.`att_id`) WHERE `booking`.`member_id` = %s limit 1""", (member_info["id"],))
				result = cursor.fetchone()
				if result == None:
					return jsonify(data = None)
				else:
					attraction = {
						"id" : result["attraction_id"],
						"name" : result["name"],
						"address" : result["address"],
						"image" : result["image"]
					}

					return_value = {
						"attraction" : attraction,
						"date" : result["date"],
						"time" : result["time"],
						"price" : result["price"]
					}
					return jsonify(data = return_value)

			elif request.method == "DELETE":
				cnx = pool.get_connection()
				cursor = cnx.cursor()
				member_info = jwt.decode(token, "secret", algorithms=["HS256"])
				cursor.execute("""DELETE FROM `booking` WHERE `member_id` = %s""", (member_info["id"],))
				cnx.commit()
				return jsonify(ok = True)
	except:
		return jsonify(error = True, message = "伺服器內部錯誤"),500
	finally:
		cursor.close()
		cnx.close()

@app.route("/api/orders", methods=["POST", "GET"])
def orderSchedule():
	try:
		token = request.cookies.get("token")
		if token == None:
				return jsonify(error = True, message = "未登入系統，拒絕存取"),403

		member_info = jwt.decode(token, "secret", algorithms=["HS256"])
		booking_info = request.get_json()
		#需要驗證booking_info嗎？
		order_time = time.localtime()
		order_no = time.strftime("%Y%m%d%H%M%S", order_time)
		url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
		pay_request_body = {
			"prime" : booking_info["prime"],
			"partner_key" : "partner_fqUnMeZkmqenfnEYVZ8QnBK8Q94AnumwFmMkuHu6SuvD1XHa69chyW0z",
			"merchant_id" : "LTHTaiwan123_ESUN",
			"details" : "TapPay Test",
			"amount" : booking_info["order"]["price"],
			"cardholder" : {
				"phone_number" : booking_info["order"]["contact"]["phone"],
				"name" : booking_info["order"]["contact"]["name"],
				"email" : booking_info["order"]["contact"]["email"],
				},
			"remember" : True
		}
		pay_request = req.Request(url,headers={
			"Content-Type" : "application/json",
			"x-api-key" : "partner_fqUnMeZkmqenfnEYVZ8QnBK8Q94AnumwFmMkuHu6SuvD1XHa69chyW0z"
		}, data = json.dumps(pay_request_body).encode("utf-8"))

		with req.urlopen(pay_request) as response:
			data = response.read().decode("utf-8")
		data = json.loads(data)
		if data["status"] == 0:
			pay_status = True
			cnx = pool.get_connection()
			cursor = cnx.cursor()
			cursor.execute("""INSERT INTO `orders`(`order_no`, `pay_status`, `member_id`, `phone`, `attraction_id`, `price`, `date`, `time`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",(order_no, pay_status, member_info["id"], booking_info["order"]["contact"]["phone"], booking_info["order"]["trip"]["attraction"]["id"], booking_info["order"]["price"], booking_info["order"]["trip"]["date"], booking_info["order"]["trip"]["time"]))
			cnx.commit()
			cursor.close()
			cnx.close()
			return_value = {
				"number" : order_no,
				"payment" : {
					"status" : data["status"],
					"message" : "付款成功"
				}
			}
			return jsonify(data=return_value)
		else:
			return_value = {
				"number" : None,
				"payment" : {
					"status" : data["status"],
					"message" : data["msg"]
				}
			}
			return jsonify(data=return_value)
	except:
		return jsonify(error = True, message = "伺服器內部錯誤"),500

app.run(port=3000, host="0.0.0.0")
