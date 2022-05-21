import datetime
import time
import mysql.connector as mysql
class DBUtil:
    def __init__(self, host, database, user, password):
        self.host = host
        self.database = database
        self.user = user
        self.password = password

    
    def store_demographic_info(self, request_json):
        db_connection = mysql.connect(host=self.host, database=self.database, user=self.user, password=self.password)
        try:
            roomid = request_json['roomid']
            player_num = request_json['player_num']
            dob = request_json['dob']
            age = request_json['age']
            gender = request_json['gender']
            native_eng = request_json['native_eng']
            first_lan = request_json['first_lan']
            eng_acq_age = request_json['eng_acq_age']
            ethnicity = request_json['ethnicity']

            ts = time.time()
            timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

            query = f'''
                INSERT INTO demographic_info (roomid, player_num, dob, age, gender, native_eng, first_lan, eng_acq_age, ethnicity, timestamp, unix_timestamp)
                    VALUES ("{roomid}", "{player_num}", "{dob}", {age}, "{gender}", {native_eng}, "{first_lan}", {eng_acq_age}, "{ethnicity}", "{timestamp}", "{ts}") '''

            cursor = db_connection.cursor()
            cursor.execute(query)
            db_connection.commit()
            cursor.close()

            db_connection.close()
            return True
        except Exception as e:
            print(e)
            db_connection.close()
            return False

    def store_survey_response(self, request_json):
        db_connection = mysql.connect(host=self.host, database=self.database, user=self.user, password=self.password)

        try:
            roomid = request_json['roomid']
            game_num = request_json['game_num']
            round_num = request_json['round_num']
            player_num = request_json['player_num']
            q1_res = request_json['q1_res']
            q2_res = request_json['q2_res']
            game_end = 1 if(request_json['game_end']) else 0
            ts = time.time()
            timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')


            query = f'''
                INSERT INTO survey_responses (roomid, game_num, round_num, player_num, q1_res, q2_res, timestamp, unix_timestamp, game_end)
                    VALUES ("{roomid}", {game_num}, {round_num}, "{player_num}", "{q1_res}", "{q2_res}", "{timestamp}", "{ts}", {game_end}) '''

            cursor = db_connection.cursor()
            cursor.execute(query)
            db_connection.commit()
            cursor.close()
            db_connection.close()
            return True
        except Exception as e:
            print(e)
            return False

    def store_player_moves(self, request_json):
        db_connection = mysql.connect(host=self.host, database=self.database, user=self.user, password=self.password)
        try:
            roomid = request_json['roomid']
            game_num = request_json['game_num']
            round_num = request_json['round_num']
            player_num = request_json['player_num']
            card_selected = request_json['card_selected']
            time_spent = request_json['time_spent']
            ts = time.time()
            timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

            query = f'''
                INSERT INTO player_moves (roomid, game_num, round_num, player_num, card_selected, timestamp, time_spent, unix_timestamp)
                    VALUES ("{roomid}", {game_num}, {round_num}, "{player_num}", "{card_selected}", "{timestamp}", "{time_spent}", "{ts}") '''

            cursor = db_connection.cursor()
            cursor.execute(query)
            db_connection.commit()
            cursor.close()
            db_connection.close()
            return True
        except Exception as e:
            print(e)
            return False
    