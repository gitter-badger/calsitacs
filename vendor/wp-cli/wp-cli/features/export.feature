Feature: Export content.

  Scenario: Basic export
    Given a WP install

    When I run `wp export`
    Then STDOUT should contain:
      """
      All done with export
      """

  Scenario: Export argument validator
    Given a WP install

    When I try `wp export --post_type=wp-cli-party`
    Then STDERR should contain:
      """
      Warning: The post type wp-cli-party does not exist.
      """

    When I try `wp export --author=invalid-author`
    Then STDERR should contain:
      """
      Warning: Could not find a matching author for invalid-author
      """

    When I try `wp export --start_date=invalid-date`
    Then STDERR should contain:
      """
      Warning: The start_date invalid-date is invalid
      """

    When I try `wp export --end_date=invalid-date`
    Then STDERR should contain:
      """
      Warning: The end_date invalid-date is invalid
      """

  Scenario: Export with post_type and post_status argument
    Given a WP install

    When I run `wp plugin install wordpress-importer --activate`
    Then STDOUT should not be empty

    When I run `wp site empty --yes`
    And I run `wp post generate --post_type=page --post_status=draft --count=10`
    And I run `wp post list --post_type=page --post_status=draft --format=count`
    Then STDOUT should be:
      """
      10
      """

    When I run `wp export --post_type=page --post_status=draft`
    And save STDOUT 'Writing to file %s' as {EXPORT_FILE}

    When I run `wp site empty --yes`
    Then STDOUT should not be empty

    When I run `wp post list --post_type=page --post_status=draft --format=count`
    Then STDOUT should be:
      """
      0
      """

    When I run `wp import {EXPORT_FILE} --authors=skip`
    Then STDOUT should not be empty

    When I run `wp post list --post_type=page --post_status=draft --format=count`
    Then STDOUT should be:
      """
      10
      """

  Scenario: Export only one post
    Given a WP install

    When I run `wp plugin install wordpress-importer --activate`
    Then STDOUT should not be empty

    When I run `wp post generate --count=10`
    And I run `wp post list --format=count`
    Then STDOUT should be:
      """
      11
      """

    When I run `wp post create --post_title='Test post' --porcelain`
    Then STDOUT should be a number
    And save STDOUT as {POST_ID}

    When I run `wp export --post__in={POST_ID}`
    And save STDOUT 'Writing to file %s' as {EXPORT_FILE}

    When I run `wp site empty --yes`
    Then STDOUT should not be empty

    When I run `wp import {EXPORT_FILE} --authors=skip`
    Then STDOUT should not be empty

    When I run `wp post list --post_type=post --format=count`
    Then STDOUT should be:
      """
      1
      """

  Scenario: Export posts within a given date range
    Given a WP install

    When I run `wp plugin install wordpress-importer --activate`
    Then STDOUT should not be empty

    When I run `wp site empty --yes`
    And I run `wp post generate --post_type=post --post_date=2013-08-01 --count=10`
    And I run `wp post generate --post_type=post --post_date=2013-08-02 --count=10`
    And I run `wp post generate --post_type=post --post_date=2013-08-03 --count=10`
    And I run `wp post list --post_type=post --format=count`
    Then STDOUT should be:
      """
      30
      """

    When I run `wp export --post_type=post --start_date=2013-08-02 --end_date=2013-08-02`
    And save STDOUT 'Writing to file %s' as {EXPORT_FILE}

    When I run `wp site empty --yes`
    Then STDOUT should not be empty

    When I run `wp post list --post_type=post --format=count`
    Then STDOUT should be:
      """
      0
      """

    When I run `wp import {EXPORT_FILE} --authors=skip`
    Then STDOUT should not be empty

    When I run `wp post list --post_type=post --format=count`
    Then STDOUT should be:
      """
      10
      """

  Scenario: Export posts from a given category
    Given a WP install

    When I run `wp plugin install wordpress-importer --activate`
    Then STDOUT should not be empty

    When I run `wp term create category Apple --porcelain`
    Then STDOUT should be a number
    And save STDOUT as {TERM_ID}

    When I run `wp site empty --yes`
    And I run `wp post generate --post_type=post --count=10`
    And I run `wp post list --post_type=post --format=count`
    Then STDOUT should be:
      """
      10
      """

    When I run `for id in $(wp post list --posts_per_page=5 --ids); do wp post term add $id category Apple; done`
    And I run `wp post list --post_type=post --cat={TERM_ID} --format=count`
    Then STDOUT should be:
      """
      5
      """

    When I run `wp export --post_type=post --category=apple`
    And save STDOUT 'Writing to file %s' as {EXPORT_FILE}
    Then the {EXPORT_FILE} file should contain:
      """
      <wp:category_nicename>apple</wp:category_nicename>
      """

    When I run `wp site empty --yes`
    Then STDOUT should not be empty

    When I run `wp post list --post_type=post --format=count`
    Then STDOUT should be:
      """
      0
      """

    When I run `wp import {EXPORT_FILE} --authors=skip`
    Then STDOUT should not be empty

    When I run `wp post list --post_type=post --format=count`
    Then STDOUT should be:
      """
      5
      """
