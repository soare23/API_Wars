from typing import List, Dict
from psycopg2 import sql
from psycopg2.extras import RealDictCursor

import database_common


@database_common.connection_handler
def add_new_user(cursor: RealDictCursor, user, password) -> list:
    query = f'''
    INSERT INTO users(username, password)
    VALUES ('{user}', '{password}')'''
    cursor.execute(query)


@database_common.connection_handler
def get_user_data_by_username(cursor: RealDictCursor, username) -> list:
    query = f'''
    SELECT * FROM users
    WHERE username = '{username}'
    '''
    cursor.execute(query)
    return cursor.fetchall()


@database_common.connection_handler
def check_user_exists(cursor: RealDictCursor, user) -> list:
    query = f'''
    SELECT username FROM users
    WHERE username = '{user}'
    '''
    cursor.execute(query)
    return cursor.fetchall()
