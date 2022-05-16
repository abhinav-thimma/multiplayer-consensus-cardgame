from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
from db_util import DBUtil
import mysql.connector as mysql
import json
 
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

HOST = '127.0.0.1'
USER = 'actionlabstudy_consensus_admin'
PASSWORD = 'Consensus123'
DB = 'actionlabstudy_consensus'

db_connection = mysql.connect(host=HOST, database=DB, user=USER, password=PASSWORD)
dbUtil = DBUtil(db_connection)

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

if __name__ == '__main__':
    app.run(debug=True)
