Cohort Manager
==========

An Open edX Django plugin application for copying cohorts from one course to
another.

Setup Instructions
------------------

On Open edX Devstack:

1. Clone this repo into your devstack's ``src`` folder::

    git clone git@github.com:open-craft/cohort-manager.git

2. Install it into LMS's devstack python environment::

    make lms-shell
    pip install -e /edx/src/cohort-manager/

3. Access cohort manager at http://localhost:18010/cohort-manager/

Frontend Development
--------------------

If you want to edit the frontend code:

1. Within the LMS container, run `npm install`.
2. To compile the js, run `make js`.
3. To build the js bundle to load in the frontend, run `make bundle`.


Test Instructions
-----------------

Run the tests from the devstack LMS shell (``make lms-shell``) using::

    make -f /edx/src/cohort-manager/Makefile validate

License
-------

The code in this repository is licensed under the AGPL 3.0 unless otherwise noted.

Please see ``LICENSE.txt`` for details.
