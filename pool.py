import mysql.connector.pooling

config = {
    'user' : 'root',
    'password' : '12345678',
    'host' : 'localhost',
    'database' : 'attractions',
    'raise_on_warnings' : True
}

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "my_pool",
    pool_size = 5,
    **config
)