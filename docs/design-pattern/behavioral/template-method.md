---
id: design-pattern-behavioral-template-method
title: "Template Method Pattern 📋"
slug: /design-pattern/behavioral/template-method
sidebar_label: "Template Method Pattern 📋"
---

# Template Method Pattern 📋

> **Definition**: The Template Method pattern defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.

## 🎯 Intent

Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.

## 🤔 Problem

You have several classes that perform similar operations with the same sequence of steps, but the implementation details differ:

- **Code Duplication**: Similar algorithms with minor variations
- **Algorithm Structure**: Want to ensure consistent algorithm structure
- **Step Variations**: Some steps need different implementations
- **Extension Points**: Need to allow customization at specific points

Without the pattern, you'd have to duplicate the entire algorithm in each class.

## 💡 Solution

The Template Method pattern suggests breaking down the algorithm into a series of steps and defining the overall structure in a base class. Subclasses can override specific steps while keeping the algorithm structure intact.

## 🏗️ Structure

```
AbstractClass
├── +templateMethod(): void → step1() + step2() + step3()
├── +step1(): void (concrete)
├── #step2(): void (abstract - must implement)
├── #step3(): void (hook - can override)

ConcreteClass1, ConcreteClass2 extend AbstractClass
├── +step2(): void (required implementation)
├── +step3(): void (optional override)
```

## 💻 Simple Example

### Data Processing Pipeline

```javascript
// Abstract template class
class DataProcessor {
  constructor() {
    if (this.constructor === DataProcessor) {
      throw new Error("DataProcessor is abstract and cannot be instantiated");
    }
  }

  // Template method - defines the algorithm structure
  processData(inputData) {
    console.log("🔄 Starting data processing pipeline...\n");

    // Step 1: Validate data (concrete method)
    if (!this.validateData(inputData)) {
      console.log("❌ Data validation failed");
      return null;
    }

    // Step 2: Extract data (abstract method - must be implemented)
    const extractedData = this.extractData(inputData);

    // Step 3: Transform data (abstract method - must be implemented)
    const transformedData = this.transformData(extractedData);

    // Step 4: Filter data (hook method - can be overridden)
    const filteredData = this.filterData(transformedData);

    // Step 5: Save data (concrete method)
    const result = this.saveData(filteredData);

    // Step 6: Generate report (hook method - can be overridden)
    this.generateReport(result);

    console.log("✅ Data processing pipeline completed\n");
    return result;
  }

  // Concrete method - same for all subclasses
  validateData(inputData) {
    console.log("🔍 Validating input data...");

    if (!inputData || inputData.length === 0) {
      console.log("❌ Input data is empty");
      return false;
    }

    console.log(`✅ Data validation passed (${inputData.length} records)`);
    return true;
  }

  // Abstract methods - must be implemented by subclasses
  extractData(inputData) {
    throw new Error("extractData() method must be implemented");
  }

  transformData(data) {
    throw new Error("transformData() method must be implemented");
  }

  // Hook methods - optional to override
  filterData(data) {
    console.log("🔧 Applying default filtering (no filtering)");
    return data;
  }

  generateReport(result) {
    console.log(`📊 Generated default report: Processed ${result.length} records`);
  }

  // Concrete method - same for all subclasses
  saveData(data) {
    console.log(`💾 Saving ${data.length} processed records to database`);

    // Simulate saving
    const savedData = data.map((record, index) => ({
      ...record,
      id: index + 1,
      savedAt: new Date().toISOString()
    }));

    console.log("✅ Data saved successfully");
    return savedData;
  }
}

// Concrete implementation - CSV Data Processor
class CSVDataProcessor extends DataProcessor {
  extractData(inputData) {
    console.log("📄 Extracting data from CSV format...");

    // Simulate CSV parsing
    const extractedData = inputData.map(row => {
      const [name, age, email, city] = row.split(',');
      return { name: name?.trim(), age: age?.trim(), email: email?.trim(), city: city?.trim() };
    });

    console.log(`✅ Extracted ${extractedData.length} records from CSV`);
    return extractedData;
  }

  transformData(data) {
    console.log("🔄 Transforming CSV data...");

    // Transform CSV data - normalize names, validate emails, etc.
    const transformedData = data.map(record => ({
      name: this.capitalizeName(record.name),
      age: parseInt(record.age) || 0,
      email: record.email?.toLowerCase(),
      city: this.capitalizeCity(record.city),
      type: 'csv_import'
    })).filter(record => record.name && record.email);

    console.log(`✅ Transformed ${transformedData.length} records`);
    return transformedData;
  }

  filterData(data) {
    console.log("🔧 Applying CSV-specific filtering (age > 0, valid email)");

    const filteredData = data.filter(record =>
      record.age > 0 && record.email && record.email.includes('@')
    );

    console.log(`✅ Filtered to ${filteredData.length} valid records`);
    return filteredData;
  }

  generateReport(result) {
    console.log("📊 Generating CSV processing report:");

    const avgAge = result.reduce((sum, r) => sum + r.age, 0) / result.length;
    const cities = [...new Set(result.map(r => r.city))];

    console.log(`   • Total records processed: ${result.length}`);
    console.log(`   • Average age: ${avgAge.toFixed(1)} years`);
    console.log(`   • Unique cities: ${cities.length} (${cities.slice(0, 3).join(', ')}${cities.length > 3 ? '...' : ''})`);
  }

  capitalizeName(name) {
    return name ? name.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ') : '';
  }

  capitalizeCity(city) {
    return city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : '';
  }
}

// Concrete implementation - JSON Data Processor
class JSONDataProcessor extends DataProcessor {
  extractData(inputData) {
    console.log("📄 Extracting data from JSON format...");

    // Simulate JSON parsing
    const extractedData = inputData.map(jsonStr => {
      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        console.log(`⚠️ Invalid JSON: ${jsonStr}`);
        return null;
      }
    }).filter(record => record !== null);

    console.log(`✅ Extracted ${extractedData.length} records from JSON`);
    return extractedData;
  }

  transformData(data) {
    console.log("🔄 Transforming JSON data...");

    // Transform JSON data - standardize field names, add metadata
    const transformedData = data.map(record => ({
      name: record.fullName || record.name || 'Unknown',
      age: record.age || record.years || 0,
      email: record.emailAddress || record.email || '',
      city: record.location || record.city || 'Unknown',
      type: 'json_import',
      originalFields: Object.keys(record).length
    }));

    console.log(`✅ Transformed ${transformedData.length} records`);
    return transformedData;
  }

  filterData(data) {
    console.log("🔧 Applying JSON-specific filtering (has name and email)");

    const filteredData = data.filter(record =>
      record.name !== 'Unknown' && record.email !== '' && record.originalFields >= 3
    );

    console.log(`✅ Filtered to ${filteredData.length} complete records`);
    return filteredData;
  }

  generateReport(result) {
    console.log("📊 Generating JSON processing report:");

    const fieldCounts = result.map(r => r.originalFields);
    const avgFields = fieldCounts.reduce((sum, count) => sum + count, 0) / fieldCounts.length;
    const emailDomains = [...new Set(result.map(r => r.email.split('@')[1]))];

    console.log(`   • Total records processed: ${result.length}`);
    console.log(`   • Average original fields: ${avgFields.toFixed(1)}`);
    console.log(`   • Email domains: ${emailDomains.length} (${emailDomains.slice(0, 3).join(', ')}${emailDomains.length > 3 ? '...' : ''})`);
  }
}

// Concrete implementation - XML Data Processor
class XMLDataProcessor extends DataProcessor {
  extractData(inputData) {
    console.log("📄 Extracting data from XML format...");

    // Simulate simple XML parsing
    const extractedData = inputData.map(xmlStr => {
      const nameMatch = xmlStr.match(/<name>(.*?)<\\/name>/);
      const ageMatch = xmlStr.match(/<age>(.*?)<\\/age>/);
      const emailMatch = xmlStr.match(/<email>(.*?)<\\/email>/);
      const cityMatch = xmlStr.match(/<city>(.*?)<\\/city>/);

      return {
        name: nameMatch ? nameMatch[1] : '',
        age: ageMatch ? ageMatch[1] : '0',
        email: emailMatch ? emailMatch[1] : '',
        city: cityMatch ? cityMatch[1] : ''
      };
    });

    console.log(`✅ Extracted ${extractedData.length} records from XML`);
    return extractedData;
  }

  transformData(data) {
    console.log("🔄 Transforming XML data...");

    const transformedData = data.map(record => ({
      name: record.name.trim(),
      age: parseInt(record.age) || 0,
      email: record.email.trim().toLowerCase(),
      city: record.city.trim(),
      type: 'xml_import'
    }));

    console.log(`✅ Transformed ${transformedData.length} records`);
    return transformedData;
  }

  // Using default filterData (no override)

  generateReport(result) {
    console.log("📊 Generating XML processing report:");
    console.log(`   • Total records processed: ${result.length}`);
    console.log(`   • Source format: XML`);
  }
}

// Usage
console.log("=== Data Processing Template Method Demo ===\n");

console.log("Sample data preparation:");
console.log("-".repeat(25));

// Sample data for different formats
const csvData = [
  "john doe,25,john.doe@email.com,new york",
  "jane smith,30,jane.smith@email.com,los angeles",
  "bob johnson,22,bob@email.com,chicago",
  "invalid row",
  "alice brown,28,alice.brown@email.com,seattle"
];

const jsonData = [
  '{"fullName": "Mike Wilson", "age": 35, "emailAddress": "mike@email.com", "location": "Boston"}',
  '{"name": "Sara Davis", "years": 29, "email": "sara@email.com", "city": "Miami"}',
  'invalid json',
  '{"fullName": "Tom Anderson", "age": 31, "emailAddress": "tom@email.com", "location": "Denver", "phone": "555-1234"}'
];

const xmlData = [
  "<record><name>Chris Lee</name><age>33</age><email>chris@email.com</email><city>Portland</city></record>",
  "<record><name>Lisa Wang</name><age>27</age><email>lisa@email.com</email><city>Austin</city></record>",
  "<record><name>David Kim</name><age>29</age><email>david@email.com</email><city>Phoenix</city></record>"
];

console.log(`✅ Prepared test data - CSV: ${csvData.length}, JSON: ${jsonData.length}, XML: ${xmlData.length}\n`);

console.log("=".repeat(60) + "\n");

console.log("1. Processing CSV Data:");
console.log("-".repeat(23));

const csvProcessor = new CSVDataProcessor();
const csvResults = csvProcessor.processData(csvData);

console.log("=".repeat(60) + "\n");

console.log("2. Processing JSON Data:");
console.log("-".repeat(24));

const jsonProcessor = new JSONDataProcessor();
const jsonResults = jsonProcessor.processData(jsonData);

console.log("=".repeat(60) + "\n");

console.log("3. Processing XML Data:");
console.log("-".repeat(23));

const xmlProcessor = new XMLDataProcessor();
const xmlResults = xmlProcessor.processData(xmlData);

console.log("=".repeat(60) + "\n");

console.log("Final Results Summary:");
console.log("-".repeat(22));

console.log(`📊 Processing Summary:`);
console.log(`   • CSV Processor: ${csvResults ? csvResults.length : 0} records processed`);
console.log(`   • JSON Processor: ${jsonResults ? jsonResults.length : 0} records processed`);
console.log(`   • XML Processor: ${xmlResults ? xmlResults.length : 0} records processed`);

const totalRecords = (csvResults?.length || 0) + (jsonResults?.length || 0) + (xmlResults?.length || 0);
console.log(`   • Total: ${totalRecords} records processed across all formats`);
```

## 🌟 Real-World Example

### Game Level Generator

```javascript
// Abstract Level Generator Template
class LevelGenerator {
  constructor() {
    if (this.constructor === LevelGenerator) {
      throw new Error('LevelGenerator is abstract');
    }
  }

  // Template method
  generateLevel(seed, difficulty) {
    console.log(`🎮 Generating ${this.constructor.name.replace('Generator', '')} level...\n`);

    // Step 1: Initialize random generator
    this.initializeRandom(seed);

    // Step 2: Set difficulty parameters
    const params = this.setupDifficultyParameters(difficulty);

    // Step 3: Generate terrain (abstract)
    const terrain = this.generateTerrain(params);

    // Step 4: Place obstacles (abstract)
    const obstacles = this.placeObstacles(terrain, params);

    // Step 5: Add enemies (abstract)
    const enemies = this.addEnemies(terrain, params);

    // Step 6: Place collectibles (hook method)
    const collectibles = this.placeCollectibles(terrain, params);

    // Step 7: Add special features (hook method)
    const specialFeatures = this.addSpecialFeatures(terrain, params);

    // Step 8: Validate level (concrete method)
    const level = this.validateAndFinalize(
      terrain,
      obstacles,
      enemies,
      collectibles,
      specialFeatures,
      params,
    );

    console.log('✅ Level generation completed\n');
    return level;
  }

  // Concrete method
  initializeRandom(seed) {
    this.seed = seed;
    this.random = this.createSeededRandom(seed);
    console.log(`🎲 Random generator initialized with seed: ${seed}`);
  }

  createSeededRandom(seed) {
    // Simple seeded random number generator
    let m = 0x80000000; // 2**31
    let a = 1103515245;
    let c = 12345;
    let state = seed;

    return () => {
      state = (a * state + c) % m;
      return state / (m - 1);
    };
  }

  // Concrete method
  setupDifficultyParameters(difficulty) {
    console.log(`⚙️ Setting up parameters for ${difficulty} difficulty`);

    const baseParams = {
      easy: { enemyCount: 5, obstaclePercent: 0.1, collectibleCount: 15 },
      medium: { enemyCount: 10, obstaclePercent: 0.2, collectibleCount: 10 },
      hard: { enemyCount: 20, obstaclePercent: 0.3, collectibleCount: 5 },
    };

    const params = baseParams[difficulty] || baseParams.medium;
    params.difficulty = difficulty;
    params.width = 100;
    params.height = 100;

    console.log(`   Enemy count: ${params.enemyCount}`);
    console.log(`   Obstacle coverage: ${params.obstaclePercent * 100}%`);
    console.log(`   Collectibles: ${params.collectibleCount}`);

    return params;
  }

  // Abstract methods - must be implemented
  generateTerrain(params) {
    throw new Error('generateTerrain() must be implemented');
  }

  placeObstacles(terrain, params) {
    throw new Error('placeObstacles() must be implemented');
  }

  addEnemies(terrain, params) {
    throw new Error('addEnemies() must be implemented');
  }

  // Hook methods - optional to override
  placeCollectibles(terrain, params) {
    console.log('💎 Placing default collectibles');

    const collectibles = [];
    for (let i = 0; i < params.collectibleCount; i++) {
      collectibles.push({
        type: 'coin',
        x: Math.floor(this.random() * params.width),
        y: Math.floor(this.random() * params.height),
        value: 10,
      });
    }

    console.log(`   Placed ${collectibles.length} coins`);
    return collectibles;
  }

  addSpecialFeatures(terrain, params) {
    console.log('✨ No special features added (default)');
    return [];
  }

  // Concrete method
  validateAndFinalize(terrain, obstacles, enemies, collectibles, specialFeatures, params) {
    console.log('🔍 Validating level...');

    const level = {
      seed: this.seed,
      difficulty: params.difficulty,
      type: this.constructor.name.replace('Generator', '').toLowerCase(),
      dimensions: { width: params.width, height: params.height },
      terrain,
      obstacles,
      enemies,
      collectibles,
      specialFeatures,
      metadata: {
        generated: new Date(),
        enemyCount: enemies.length,
        obstacleCount: obstacles.length,
        collectibleCount: collectibles.length,
        specialFeatureCount: specialFeatures.length,
      },
    };

    // Validate level has start and end points
    level.startPoint = { x: 0, y: 0 };
    level.endPoint = { x: params.width - 1, y: params.height - 1 };

    console.log('✅ Level validation passed');
    console.log(`   Dimensions: ${level.dimensions.width}x${level.dimensions.height}`);
    console.log(
      `   Elements: ${level.metadata.enemyCount} enemies, ${level.metadata.obstacleCount} obstacles, ${level.metadata.collectibleCount} collectibles`,
    );

    return level;
  }
}

// Concrete implementation - Forest Level
class ForestLevelGenerator extends LevelGenerator {
  generateTerrain(params) {
    console.log('🌲 Generating forest terrain');

    const terrain = [];
    for (let y = 0; y < params.height; y++) {
      terrain[y] = [];
      for (let x = 0; x < params.width; x++) {
        const tileType = this.random() < 0.7 ? 'grass' : this.random() < 0.8 ? 'dirt' : 'water';
        terrain[y][x] = {
          type: tileType,
          walkable: tileType !== 'water',
          x,
          y,
        };
      }
    }

    console.log('   Generated forest terrain with grass, dirt, and water tiles');
    return terrain;
  }

  placeObstacles(terrain, params) {
    console.log('🌳 Placing forest obstacles (trees, rocks)');

    const obstacles = [];
    const targetCount = Math.floor(params.width * params.height * params.obstaclePercent);

    for (let i = 0; i < targetCount; i++) {
      const x = Math.floor(this.random() * params.width);
      const y = Math.floor(this.random() * params.height);

      if (terrain[y][x].walkable) {
        const obstacleType = this.random() < 0.7 ? 'tree' : 'rock';
        obstacles.push({
          type: obstacleType,
          x,
          y,
          blocking: true,
          health: obstacleType === 'tree' ? 3 : 5,
        });
        terrain[y][x].walkable = false;
      }
    }

    console.log(`   Placed ${obstacles.length} forest obstacles`);
    return obstacles;
  }

  addEnemies(terrain, params) {
    console.log('🐻 Adding forest enemies (bears, wolves)');

    const enemies = [];
    const enemyTypes = ['bear', 'wolf', 'spider'];

    for (let i = 0; i < params.enemyCount; i++) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 50) {
        const x = Math.floor(this.random() * params.width);
        const y = Math.floor(this.random() * params.height);

        if (terrain[y][x].walkable) {
          const enemyType = enemyTypes[Math.floor(this.random() * enemyTypes.length)];
          enemies.push({
            type: enemyType,
            x,
            y,
            health: enemyType === 'bear' ? 30 : enemyType === 'wolf' ? 20 : 10,
            damage: enemyType === 'bear' ? 8 : enemyType === 'wolf' ? 5 : 3,
            speed: enemyType === 'spider' ? 3 : enemyType === 'wolf' ? 2 : 1,
          });
          placed = true;
        }
        attempts++;
      }
    }

    console.log(`   Added ${enemies.length} forest creatures`);
    return enemies;
  }

  placeCollectibles(terrain, params) {
    console.log('🍄 Placing forest collectibles (mushrooms, berries)');

    const collectibles = [];
    const collectibleTypes = [
      { type: 'mushroom', value: 15, rarity: 0.3 },
      { type: 'berries', value: 8, rarity: 0.5 },
      { type: 'healing_herb', value: 25, rarity: 0.2 },
    ];

    for (let i = 0; i < params.collectibleCount; i++) {
      const x = Math.floor(this.random() * params.width);
      const y = Math.floor(this.random() * params.height);

      if (terrain[y][x].walkable) {
        const roll = this.random();
        let selectedType = collectibleTypes[0];

        for (const type of collectibleTypes) {
          if (roll <= type.rarity) {
            selectedType = type;
            break;
          }
        }

        collectibles.push({
          type: selectedType.type,
          x,
          y,
          value: selectedType.value,
        });
      }
    }

    console.log(`   Placed ${collectibles.length} forest collectibles`);
    return collectibles;
  }

  addSpecialFeatures(terrain, params) {
    console.log('🏛️ Adding forest special features (ancient shrine)');

    const features = [];

    // Add an ancient shrine for hard difficulty
    if (params.difficulty === 'hard') {
      const shrineX = Math.floor(params.width / 2);
      const shrineY = Math.floor(params.height / 2);

      features.push({
        type: 'ancient_shrine',
        x: shrineX,
        y: shrineY,
        effect: 'heal_all',
        description: 'An ancient shrine that fully heals the player',
      });

      console.log('   Added ancient healing shrine');
    }

    // Add hidden treasure for medium/hard
    if (params.difficulty !== 'easy') {
      const treasureX = Math.floor(this.random() * params.width);
      const treasureY = Math.floor(this.random() * params.height);

      features.push({
        type: 'hidden_treasure',
        x: treasureX,
        y: treasureY,
        effect: 'gold_bonus',
        value: params.difficulty === 'hard' ? 1000 : 500,
        description: 'A hidden treasure chest',
      });

      console.log('   Added hidden treasure chest');
    }

    return features;
  }
}

// Concrete implementation - Dungeon Level
class DungeonLevelGenerator extends LevelGenerator {
  generateTerrain(params) {
    console.log('🏰 Generating dungeon terrain');

    const terrain = [];
    for (let y = 0; y < params.height; y++) {
      terrain[y] = [];
      for (let x = 0; x < params.width; x++) {
        const tileType = this.random() < 0.6 ? 'floor' : 'wall';
        terrain[y][x] = {
          type: tileType,
          walkable: tileType === 'floor',
          x,
          y,
        };
      }
    }

    // Create corridors
    this.createCorridors(terrain, params);

    console.log('   Generated dungeon with rooms and corridors');
    return terrain;
  }

  createCorridors(terrain, params) {
    // Simple corridor creation - horizontal and vertical paths
    const midY = Math.floor(params.height / 2);
    const midX = Math.floor(params.width / 2);

    // Horizontal corridor
    for (let x = 0; x < params.width; x++) {
      terrain[midY][x] = { type: 'floor', walkable: true, x, y: midY };
    }

    // Vertical corridor
    for (let y = 0; y < params.height; y++) {
      terrain[y][midX] = { type: 'floor', walkable: true, x: midX, y };
    }
  }

  placeObstacles(terrain, params) {
    console.log('⛩️ Placing dungeon obstacles (pillars, traps)');

    const obstacles = [];
    const targetCount = Math.floor(params.width * params.height * params.obstaclePercent);

    for (let i = 0; i < targetCount; i++) {
      const x = Math.floor(this.random() * params.width);
      const y = Math.floor(this.random() * params.height);

      if (terrain[y][x].walkable) {
        const obstacleType = this.random() < 0.5 ? 'pillar' : 'spike_trap';
        obstacles.push({
          type: obstacleType,
          x,
          y,
          blocking: obstacleType === 'pillar',
          damage: obstacleType === 'spike_trap' ? 10 : 0,
        });

        if (obstacleType === 'pillar') {
          terrain[y][x].walkable = false;
        }
      }
    }

    console.log(`   Placed ${obstacles.length} dungeon obstacles`);
    return obstacles;
  }

  addEnemies(terrain, params) {
    console.log('💀 Adding dungeon enemies (skeletons, goblins)');

    const enemies = [];
    const enemyTypes = ['skeleton', 'goblin', 'orc'];

    for (let i = 0; i < params.enemyCount; i++) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 50) {
        const x = Math.floor(this.random() * params.width);
        const y = Math.floor(this.random() * params.height);

        if (terrain[y][x].walkable) {
          const enemyType = enemyTypes[Math.floor(this.random() * enemyTypes.length)];
          enemies.push({
            type: enemyType,
            x,
            y,
            health: enemyType === 'orc' ? 40 : enemyType === 'goblin' ? 15 : 25,
            damage: enemyType === 'orc' ? 12 : enemyType === 'goblin' ? 4 : 8,
            armor: enemyType === 'skeleton' ? 3 : enemyType === 'orc' ? 2 : 0,
          });
          placed = true;
        }
        attempts++;
      }
    }

    console.log(`   Added ${enemies.length} dungeon monsters`);
    return enemies;
  }

  placeCollectibles(terrain, params) {
    console.log('💰 Placing dungeon collectibles (gold, gems)');

    const collectibles = [];
    const collectibleTypes = [
      { type: 'gold_pile', value: 50, rarity: 0.4 },
      { type: 'ruby', value: 100, rarity: 0.2 },
      { type: 'magic_scroll', value: 75, rarity: 0.3 },
      { type: 'health_potion', value: 40, rarity: 0.1 },
    ];

    for (let i = 0; i < params.collectibleCount; i++) {
      const x = Math.floor(this.random() * params.width);
      const y = Math.floor(this.random() * params.height);

      if (terrain[y][x].walkable) {
        const roll = this.random();
        let selectedType = collectibleTypes[0];

        for (const type of collectibleTypes) {
          if (roll <= type.rarity) {
            selectedType = type;
            break;
          }
        }

        collectibles.push({
          type: selectedType.type,
          x,
          y,
          value: selectedType.value,
        });
      }
    }

    console.log(`   Placed ${collectibles.length} dungeon treasures`);
    return collectibles;
  }

  addSpecialFeatures(terrain, params) {
    console.log('🗝️ Adding dungeon special features');

    const features = [];

    // Always add a boss room in dungeons
    const bossX = Math.floor(this.random() * params.width);
    const bossY = Math.floor(this.random() * params.height);

    features.push({
      type: 'boss_room',
      x: bossX,
      y: bossY,
      effect: 'spawn_boss',
      description: 'A dark chamber where the dungeon boss awaits',
    });

    // Add teleportation circles for medium/hard
    if (params.difficulty !== 'easy') {
      const teleCount = params.difficulty === 'hard' ? 3 : 2;

      for (let i = 0; i < teleCount; i++) {
        features.push({
          type: 'teleporter',
          x: Math.floor(this.random() * params.width),
          y: Math.floor(this.random() * params.height),
          effect: 'teleport',
          targetId: i,
          description: `Magical teleportation circle #${i + 1}`,
        });
      }

      console.log(`   Added boss room and ${teleCount} teleporters`);
    } else {
      console.log('   Added boss room');
    }

    return features;
  }
}

// Usage
console.log('\n=== Game Level Generator Template Method Demo ===\n');

console.log('Generating different level types:');
console.log('-'.repeat(35));

const seed = 12345;
const difficulties = ['easy', 'medium', 'hard'];

console.log('1. Forest Levels:');
console.log('-'.repeat(16));

const forestGenerator = new ForestLevelGenerator();

difficulties.forEach((difficulty, index) => {
  console.log(`\n${index + 1}.${index + 1} Forest Level - ${difficulty.toUpperCase()}:`);
  console.log('-'.repeat(30));

  const forestLevel = forestGenerator.generateLevel(seed + index, difficulty);

  console.log(`📋 Generated Level Summary:`);
  console.log(`   Type: ${forestLevel.type}`);
  console.log(`   Seed: ${forestLevel.seed}`);
  console.log(`   Size: ${forestLevel.dimensions.width}x${forestLevel.dimensions.height}`);
  console.log(`   Enemies: ${forestLevel.metadata.enemyCount}`);
  console.log(`   Obstacles: ${forestLevel.metadata.obstacleCount}`);
  console.log(`   Collectibles: ${forestLevel.metadata.collectibleCount}`);
  console.log(`   Special Features: ${forestLevel.metadata.specialFeatureCount}`);
});

console.log('\n' + '='.repeat(70) + '\n');

console.log('2. Dungeon Levels:');
console.log('-'.repeat(17));

const dungeonGenerator = new DungeonLevelGenerator();

difficulties.forEach((difficulty, index) => {
  console.log(`\n${index + 1}.${index + 1} Dungeon Level - ${difficulty.toUpperCase()}:`);
  console.log('-'.repeat(32));

  const dungeonLevel = dungeonGenerator.generateLevel(seed + index + 100, difficulty);

  console.log(`📋 Generated Level Summary:`);
  console.log(`   Type: ${dungeonLevel.type}`);
  console.log(`   Seed: ${dungeonLevel.seed}`);
  console.log(`   Size: ${dungeonLevel.dimensions.width}x${dungeonLevel.dimensions.height}`);
  console.log(`   Enemies: ${dungeonLevel.metadata.enemyCount}`);
  console.log(`   Obstacles: ${dungeonLevel.metadata.obstacleCount}`);
  console.log(`   Collectibles: ${dungeonLevel.metadata.collectibleCount}`);
  console.log(`   Special Features: ${dungeonLevel.metadata.specialFeatureCount}`);
});

console.log('\n' + '='.repeat(70) + '\n');

console.log('Level Generation Performance Summary:');
console.log('-'.repeat(38));

const startTime = Date.now();

// Generate batch of levels
const batchResults = [];
for (let i = 0; i < 6; i++) {
  const generator = i % 2 === 0 ? new ForestLevelGenerator() : new DungeonLevelGenerator();
  const difficulty = difficulties[i % 3];
  const level = generator.generateLevel(seed + i + 1000, difficulty);

  batchResults.push({
    type: level.type,
    difficulty: level.difficulty,
    elements:
      level.metadata.enemyCount + level.metadata.obstacleCount + level.metadata.collectibleCount,
  });
}

const endTime = Date.now();
const totalTime = endTime - startTime;

console.log(`⏱️ Batch Generation Results:`);
console.log(`   Total Levels Generated: ${batchResults.length}`);
console.log(`   Total Time: ${totalTime}ms`);
console.log(`   Average Time per Level: ${(totalTime / batchResults.length).toFixed(1)}ms`);

batchResults.forEach((result, index) => {
  console.log(
    `   Level ${index + 1}: ${result.type} (${result.difficulty}) - ${result.elements} elements`,
  );
});
```

## ✅ Pros

- **Code Reuse**: Common algorithm structure is reused across subclasses
- **Consistency**: Ensures all implementations follow the same algorithm steps
- **Extensibility**: Easy to add new variations by subclassing
- **Control**: Superclass controls the algorithm flow
- **Flexibility**: Subclasses can customize specific steps

## ❌ Cons

- **Inheritance Dependency**: Requires inheritance relationship
- **Limited Flexibility**: Algorithm structure is fixed
- **Complex Hierarchies**: Can lead to complex inheritance hierarchies
- **Debugging Difficulty**: Algorithm flow spans multiple classes

## 🎯 When to Use

- **Similar Algorithms**: Multiple classes implement similar algorithms with slight variations
- **Code Duplication**: Want to eliminate duplicate algorithm structure
- **Step Customization**: Need to customize specific steps while keeping overall structure
- **Framework Development**: Building frameworks where users extend base behavior
- **Workflow Processing**: Multi-step processes with customizable steps

## 🔄 Template Method Variations

### 1. **Hook Methods**

```javascript
class TemplateWithHooks {
  templateMethod() {
    this.stepOne();

    if (this.shouldExecuteStepTwo()) {
      this.stepTwo();
    }

    this.stepThree();
  }

  // Hook method - default implementation
  shouldExecuteStepTwo() {
    return true;
  }
}
```

### 2. **Strategy-Template Hybrid**

```javascript
class StrategyTemplate {
  constructor(strategy) {
    this.strategy = strategy;
  }

  templateMethod() {
    this.beforeProcess();
    this.strategy.execute();
    this.afterProcess();
  }
}
```

### 3. **Functional Template Method**

```javascript
class FunctionalTemplate {
  templateMethod(stepImplementations) {
    this.stepOne();
    stepImplementations.customStep();
    this.stepThree();
  }
}
```

## 🔗 Related Patterns

- **Strategy**: Both define algorithm families, but Template Method uses inheritance while Strategy uses composition
- **Factory Method**: Often used within Template Method to create objects
- **Command**: Template steps can be implemented as commands
- **Decorator**: Can be used to add behavior to template steps

## 📚 Further Reading

- [Template Method Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/template-method)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Hollywood Principle: Don't call us, we'll call you](https://en.wikipedia.org/wiki/Hollywood_principle)
