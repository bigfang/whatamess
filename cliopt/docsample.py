"""
Usage:
  horn new <proj> [--app=<app> --proj=<proj> --bare --pypi=<pypi>]
  horn gen (api | service) <service> <module> <table> <fields>...
  horn gen model <module> <table> <fields>...
  horn gen schema <module> <fields>...
  horn (-h | --help)
  horn --version

Options:
  -h --help         Show this screen.
  --version         Show version.
  --app=<app>       App name.
  --proj=<proj>     Project name.
  --pypi=<pypi>     Pypi link [default: pypi.org].
  --bare            bare project.

"""
from docopt import docopt


if __name__ == '__main__':
    arguments = docopt(__doc__, version='Horn 0.1.0')
    print(arguments)
