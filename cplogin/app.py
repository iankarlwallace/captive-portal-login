#
# Captive Portal Login - written in Python3
#
# Simple script to login to the firewall login page
# afterwards it will periodically logout
# wait a few minutes
# reload the page until the login is available and then login
#

import argparse
import sys

from common import log
import config

from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

def run():
    mLog = log.getLogger()
    mLog.info('Starting CP Login')
    mLog.debug('Parsing of command line args %s', sys.argv)

    parser = argparse.ArgumentParser()
    parser.add_argument('-u',
        '--user',
        required=True,
        help="Portal Login Username")
    parser.add_argument('-p',
        '--password',
        required=True,
        help="Portal Login Password")
    args = parser.parse_args()

    mLog.debug('Args %s', args)

    mCred = cred.Credentials(args.cures_username, args.cures_password, args.emr_username, args.emr_password)
    mLog.debug('Credentials object created')

    patients = db.Dbtools().load_patients()
    mLog.debug('Found [' + str(len(patients)) + '] patients.')

    # mCures = cures.Curestools(mCred)
    # mCures.login()

    mLog.debug('Starting EMR Scrapper Logging in.')
    mEmr = emr.Emrtools(mCred)
    mEmr.login()
    time.sleep(5)

    for patient in patients:
        mLog.debug('Looking up patient ' + patient.getFirstname() + ' ' + patient.getLastname())
        mLog.debug('MRN for lookup ' + patient.getMrn())
        mEmr.search(patient.getMrn())

    mLog.info('Finished logging out.')
    mEmr.logout()
    time.sleep(5)
    mLog.info('Finished EMR Scrapper')
