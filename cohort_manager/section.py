# -*- coding: utf-8 -*-
"""
Cohort Manager Django application initialization.
"""

from __future__ import absolute_import, unicode_literals

import pkg_resources

class Tab(object):
    section_key = 'cohort_manager'
    section_display_name = 'Cohort Manager'
    priority = 0

    def __init__(self, course, access):
        self.access = access
        self.course_id = course.id

    def to_dict(self):
        return {
            'section_key': self.section_key,
            'section_display_name': self.section_display_name,
            'course_id': self.course_id,
            'access': self.access,
        }
