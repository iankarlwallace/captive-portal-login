# Common logging setup so that python files can import common.log
# Then they can retrieve the logger with getLogger() which returns the 'root' logger
#

import logging

def getLogger():
    formatter = logging.Formatter(fmt='%(asctime)s - %(levelname)s - %(module)s - %(message)s')

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger('root')
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)
    return logger
