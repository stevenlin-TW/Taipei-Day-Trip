import json
import mysql.connector

file = open('/Users/StevenLin/Desktop/taipei-day-trip/data/taipei-attractions.json', 'r')
data = json.loads(file.read())
attraction_list = data['result']['results']
#print(attraction_list[23])

config = {
    'user' : 'root',
    'password' : '12345678',
    'host' : 'localhost',
    'database' : 'attractions',
    'raise_on_warnings' : True
}
cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()

for attraction in attraction_list:
    att_id = attraction["_id"]
    file_list = attraction['file'].replace('JPG', 'jpg').split('http')
    img_list = []
    for file_member in file_list:
        if file_member[-3:] == "jpg":
            file_member = 'http' + file_member
            img_list.append(file_member)
    
    for img in img_list:
        cursor.execute("""INSERT INTO `att_image`(`att_id`, `img_url`) VALUES (%s, %s)""", (att_id, img))
        cnx.commit()
#     name = attraction["name"]
#     category = attraction["CAT"]
#     description = attraction["description"]
#     address = attraction["address"]
#     transport = attraction["direction"]
#     mrt = attraction["MRT"]
#     lat = attraction["latitude"]
#     lng = attraction["longitude"]
#     cursor.execute("INSERT INTO `taipei`(`att_id`, `name`, `category`, `description`, `address`, `transport`, `mrt`, `lat`, `lng`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", 
#         (att_id, name, category, description, address, transport, mrt, lat, lng))
#     cnx.commit()
#     #print("%s, %s, %s, %s, %s, %s, %s, %s, %s" %(id, name, category, description, address, transport, mrt, lat, lng))

cursor.close()
cnx.close()



