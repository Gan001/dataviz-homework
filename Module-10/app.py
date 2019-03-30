from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func
import numpy as np
import pandas as pd
import datetime as dt
from collections import defaultdict

#create engine connect args allows for use of one session engine for all functions(otherwise make new session in function)
engine = create_engine("sqlite:///Resources/hawaii.sqlite", connect_args= {"check_same_thread":False})
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

# Design a query to retrieve the last 12 months of precipitation data 
date_query = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
last_year = date_query[0]
last_year_split = last_year.split("-")
last_year_split[0] = str(int(last_year_split[0])-1)
one_year_ago = "-".join(last_year_split)

#Setup Flask
app = Flask(__name__)

#Flask routes
@app.route("/")
def welcome():
    return (f"Welcome to the Climate App!<br/>"
            f"Available Routes:<br/>"
            f"/api/v1.0/precipitation<br/>"
            f"/api/v1.0/stations<br/>"
            f"/api/v1.0/tobs<br/>"
            f"To search by date:<br/>"
            f"/api/v1.0/start_date<br/>"
            f"To search by date range:<br/>"
            f"/api/v1.0/start_date/end_date")


@app.route("/api/v1.0/precipitation")
def precipitation():
    # Perform a query to retrieve the data and precipitation scores
    results = session.query(Measurement.date, Measurement.prcp).\
            filter(Measurement.date >= one_year_ago).filter(Measurement.prcp != "None").all()

    # Save the query results as a Pandas DataFrame and create a dictionary
    prcp_df = pd.DataFrame(results).sort_values('date')
    prcp_dict = prcp_df.to_dict('records')
    
    # default dict appends list if key is same otherwise makes new key, use this or lose prcp values due to multiple non-unique keys
    prcp_default = defaultdict(list)
    for i in range(len(prcp_dict)):
        prcp_default[prcp_dict[i]['date']].append(prcp_dict[i]['prcp'])
    
    #convert to regular dict
    adjust_prcp_dict = dict(prcp_default)

    #return jsonified dictionary
    return jsonify(adjust_prcp_dict)

@app.route("/api/v1.0/stations")
def station_lists():
    stations = session.query(Measurement.station).group_by(Measurement.station).all()
    station_list =[]
    for station in stations:
        station_list.append(station[0])
        
    return jsonify(station_list)

@app.route("/api/v1.0/tobs")
def observations():
    tobs = session.query(Measurement.tobs).order_by(Measurement.station).\
           filter(Measurement.date >= one_year_ago).all()

    return jsonify(list(np.ravel(tobs)))

@app.route("/api/v1.0/<start>")
def calc_start_temp(start):
    calc = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
           filter(Measurement.date >= start).all()

    return jsonify(calc[0])

@app.route("/api/v1.0/<start>/<end>")
def calc_start_end_temp(start, end):
    calc = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
           filter(Measurement.date >= start).filter(Measurement.date <= end).all()

    return jsonify(calc[0])


if __name__ == "__main__":
    app.run(debug=True)
