# Changelog

2.0.0
---
- Removed auto conversion of string in the `.rejects` to Error. So now if you reject a string, the rejected value will remain a string

1.1.1
---
- Added new helper methods for spies to auto unwrap any promise returned from a method or passed into a method. This allows directly comparing values rather than needing to manually unwrap them each time.

1.0.0
---
- Initial release
