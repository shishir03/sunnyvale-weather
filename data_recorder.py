import os

os.environ["AMBIENT_ENDPOINT"] = 'https://api.ambientweather.net/v1'
os.environ["AMBIENT_API_KEY"] = 'ae6adf691961484cad033bf3b9c6d6fcc7fcd509e19145e1a4f2c18d057e4de9'
os.environ["AMBIENT_APPLICATION_KEY"] = '0bdd59132b424e0c832a53c1f6c0960e46eb59f9a7704afd8821f4692b2c9a54'

from ambient_api.ambientapi import AmbientAPI

api = AmbientAPI()

devices = api.get_devices()
home = devices[0]
weather = home.last_data

# File Format
# Timestamp Temp Dewpoint Pressure Speed Gust Dir Rainfall Rainrate Radiation

os.system("cd shishir03.github.io")
os.system('echo "' + str(weather.get("dateutc")) + ',' + str(weather.get("tempf")) + ',' + str(weather.get("dewPoint"))
          + ',' + str(weather.get("baromrelin")) + ',' + str(weather.get("windspeedmph")) + "," + str(weather.get("windgustmph"))
          + "," + str(weather.get("winddir")) + "," + str(weather.get("dailyrainin")) + "," + str(weather.get("hourlyrainin"))
          + "," + str(weather.get("solarradiation")) + '" >> data.csv')
os.system("git add --all")
os.system('git commit -m "Added a new entry"')
os.system('git push -u origin master')