from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
from db_util import DBUtil
import json
 
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

HOST = '127.0.0.1'
USER = 'root'
PASSWORD = ''
DB = 'actionlabstudy_consensus'

dbUtil = DBUtil(host=HOST, database=DB, user=USER, password=PASSWORD)

@app.route('/')
@cross_origin()
def home():
    return "hello"

@app.route('/demographic', methods=['POST'])
@cross_origin()
def store_demographic_info():
    request_data = request.get_json()
    result = dbUtil.store_demographic_info(request_data)

    response = {}
    if(result):
        response = {"status": "SUCCESS"}
    else:
        response = {"status": "FAILURE"}
    
    resp = Response(json.dumps(response), status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Content-Type'] = 'application/json'

    return resp

@app.route('/survey', methods=['POST'])
@cross_origin()
def store_survey_results():
    request_data = request.get_json()
    result = dbUtil.store_survey_response(request_data)

    response = {}
    if(result):
        response = {"status": "SUCCESS"}
    else:
        response = {"status": "FAILURE"}
    
    resp = Response(json.dumps(response), status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Content-Type'] = 'application/json'

    return resp
    

@app.route('/moves', methods=['POST'])
@cross_origin()
def store_player_moves():
    request_data = request.get_json()
    result = dbUtil.store_player_moves(request_data)

    response = {}
    if(result):
        response = {"status": "SUCCESS"}
    else:
        response = {"status": "FAILURE"}
    
    resp = Response(json.dumps(response), status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Content-Type'] = 'application/json'

    return resp

@app.route('/roomConfig', methods=['GET'])
@cross_origin()
def get_room_config():
    args = request.args
    room_id = args.get("roomId")

    result = dbUtil.get_room_config(room_id)

    return result


if __name__ == '__main__':
    app.run(debug=True)
