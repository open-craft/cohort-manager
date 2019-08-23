"""
LMS URL configuration for Cohort Manager.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from django.conf.urls import include, url

from . import views

urlpatterns = [
    url(r'^cohort-manager/', include([
        url(r'.*', views.CohortManagerSpaView.as_view()),
    ])),
]

