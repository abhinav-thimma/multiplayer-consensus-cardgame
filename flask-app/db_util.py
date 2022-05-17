import datetime
import time

class DBUtil:
    def __init__(self, db_connection):
        self.db_connection = db_connection
    
    def store_demographic_info(self, request_json):
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
                INSERT INTO demographic_info (roomid, player_num, dob, age, gender, native_eng, first_lan, eng_acq_age, ethnicity, timestamp)
                    VALUES ("{roomid}", "{player_num}", "{dob}", {age}, "{gender}", {native_eng}, "{first_lan}", {eng_acq_age}, "{ethnicity}", "{timestamp}") '''

            cursor = self.db_connection.cursor()
            cursor.execute(query)
            self.db_connection.commit()
            cursor.close()
            return True
        except Exception as e:
            print(e)
            return False

    def store_survey_response(self, request_json):
        try:
            roomid = request_json['roomid']
            game_num = request_json['game_num']
            round_num = request_json['round_num']
            player_num = request_json['player_num']
            q1_res = request_json['q1_res']
            q2_res = request_json['q2_res']
            ts = time.time()
            timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')


            query = f'''
                INSERT INTO survey_responses (roomid, game_num, round_num, player_num, q1_res, q2_res, timestamp)
                    VALUES ("{roomid}", {game_num}, {round_num}, "{player_num}", "{q1_res}", "{q2_res}", "{timestamp}") '''

            cursor = self.db_connection.cursor()
            cursor.execute(query)
            self.db_connection.commit()
            cursor.close()
            return True
        except Exception as e:
            print(e)
            return False

    def store_player_moves(self, request_json):
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
                INSERT INTO player_moves (roomid, game_num, round_num, player_num, card_selected, timestamp, time_spent)
                    VALUES ("{roomid}", {game_num}, {round_num}, "{player_num}", "{card_selected}", "{timestamp}", "{time_spent}") '''

            cursor = self.db_connection.cursor()
            cursor.execute(query)
            self.db_connection.commit()
            cursor.close()
            return True
        except Exception as e:
            print(e)
            return False


