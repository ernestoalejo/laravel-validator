    $value = $<%= object %>;
    if (is_null($value)) {
      $value = array();
    }
    if (!is_array($value)) {
      self::error($data, 'key ' . <%= name %> . ' is not an array');
    }
    if (count($value) < <%= mincount %>) {
      self::error($data, 'array ' . <%= name %> . ' has less than <%= mincount %> items');
    }
    $<%= result %> = array();

    $size<%= id %> = count($<%= object %>);
    for ($i<%= id %> = 0; $i<%= id %> < $size<%= id %>; $i<%= id %>++) {
      if (!isset($<%= object %>[$i<%= id %>])) {
        self::error($data, 'array has not key ' . $i<%= id %>);
      }
