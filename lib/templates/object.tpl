    $value = $<%= object %>;
    if (is_null($value)) {
      $value = array();
    }
    if (!is_array($value)) {
      self::error($data, 'key ' . <%= name %> . ' is not an object');
    }
    $<%= result %> = array();
