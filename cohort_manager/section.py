# -*- coding: utf-8 -*-
"""
Cohort Manager Django application initialization.
"""

from __future__ import absolute_import, unicode_literals

import pkg_resources

def section(course, access):
    """ Provide data for the corresponding dashboard section """
    course_key = course.id

    section_data = {
        # 'compiled_js': pkg_resources.resource_string('cohort_manager', 'js-dist/bundle.js'),
        'section_key': 'cohort_manager',
        'section_display_name': 'Cohort Manager',
        'access': access,
        'course_id': course_key,
        'course_display_name': course.display_name_with_default,
        'course_org': course.display_org_with_default,
        'course_number': course.display_number_with_default,
        'has_started': course.has_started(),
        'has_ended': course.has_ended(),
        'start_date': course.start,
        'end_date': course.end,
        'num_sections': len(course.children),
        'list_instructor_tasks_url': 'https://example.com/',
    }

    return section_data
