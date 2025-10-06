const { MetadataStorage } = require("@mikro-orm/core")

process.chdir(__dirname)
MetadataStorage.clear()
