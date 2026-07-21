# Prototype Pattern 🧬

> **Definition**: The Prototype pattern allows you to create new objects by cloning existing instances (prototypes) rather than creating new instances from scratch.

## 🎯 Intent

Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype. This pattern is useful when object creation is costly or complex.

## 🤔 Problem

You need to create objects that are similar to existing objects but with some modifications. Creating objects from scratch might be:

- **Expensive**: Complex initialization or resource-intensive setup
- **Complex**: Requires many parameters or configuration steps
- **Dynamic**: Object types are determined at runtime
- **Configuration-heavy**: Objects have many settings that vary slightly

## 💡 Solution

The Prototype pattern suggests creating objects by cloning existing instances rather than instantiating new ones. The pattern involves creating a prototype interface that declares a `clone()` method, and concrete classes implement this method to return copies of themselves.

## 🏗️ Structure

```
Prototype (interface)
└── clone()

ConcretePrototype implements Prototype
├── field1, field2, field3
└── clone() → return copy of this

Client
├── prototype: Prototype
└── operation() → prototype.clone()
```

## 💻 Simple Example

### Document Templates

```javascript
// Prototype interface
class DocumentPrototype {
  clone() {
    throw new Error('clone() method must be implemented');
  }
}

// Concrete prototype - Resume document
class Resume extends DocumentPrototype {
  constructor(name = '', experience = [], skills = [], template = 'classic') {
    super();
    this.type = 'Resume';
    this.name = name;
    this.experience = [...experience]; // Deep copy array
    this.skills = [...skills]; // Deep copy array
    this.template = template;
    this.createdAt = new Date();
    this.id = Math.random().toString(36).substr(2, 9);
  }

  clone() {
    console.log(`🧬 Cloning resume: ${this.name || 'Unnamed'}`);

    // Create a deep copy
    const cloned = new Resume(
      this.name,
      this.experience.map((exp) => ({ ...exp })), // Deep copy objects in array
      [...this.skills], // Copy array
      this.template,
    );

    // Reset some fields for the clone
    cloned.id = Math.random().toString(36).substr(2, 9);
    cloned.createdAt = new Date();

    console.log(`✅ Resume cloned with ID: ${cloned.id}`);
    return cloned;
  }

  addExperience(company, position, years) {
    this.experience.push({ company, position, years });
    console.log(`💼 Added experience: ${position} at ${company}`);
  }

  addSkill(skill) {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
      console.log(`🎯 Added skill: ${skill}`);
    }
  }

  setName(name) {
    this.name = name;
    console.log(`👤 Name set to: ${name}`);
  }

  display() {
    console.log(`📄 Resume Details:`);
    console.log(`   ID: ${this.id}`);
    console.log(`   Name: ${this.name}`);
    console.log(`   Template: ${this.template}`);
    console.log(`   Experience: ${this.experience.length} jobs`);
    console.log(`   Skills: ${this.skills.join(', ')}`);
    console.log(`   Created: ${this.createdAt.toLocaleDateString()}`);
  }
}

// Concrete prototype - Cover Letter document
class CoverLetter extends DocumentPrototype {
  constructor(recipientCompany = '', position = '', template = 'formal') {
    super();
    this.type = 'Cover Letter';
    this.recipientCompany = recipientCompany;
    this.position = position;
    this.template = template;
    this.paragraphs = [];
    this.createdAt = new Date();
    this.id = Math.random().toString(36).substr(2, 9);
  }

  clone() {
    console.log(`🧬 Cloning cover letter for: ${this.position} at ${this.recipientCompany}`);

    const cloned = new CoverLetter(this.recipientCompany, this.position, this.template);

    // Deep copy paragraphs
    cloned.paragraphs = [...this.paragraphs];

    // Reset some fields
    cloned.id = Math.random().toString(36).substr(2, 9);
    cloned.createdAt = new Date();

    console.log(`✅ Cover letter cloned with ID: ${cloned.id}`);
    return cloned;
  }

  addParagraph(content) {
    this.paragraphs.push(content);
    console.log(`📝 Added paragraph (${content.substring(0, 30)}...)`);
  }

  setRecipient(company, position) {
    this.recipientCompany = company;
    this.position = position;
    console.log(`🏢 Set recipient: ${position} at ${company}`);
  }

  display() {
    console.log(`📄 Cover Letter Details:`);
    console.log(`   ID: ${this.id}`);
    console.log(`   Company: ${this.recipientCompany}`);
    console.log(`   Position: ${this.position}`);
    console.log(`   Template: ${this.template}`);
    console.log(`   Paragraphs: ${this.paragraphs.length}`);
    console.log(`   Created: ${this.createdAt.toLocaleDateString()}`);
  }
}

// Usage
console.log('=== Document Prototype Demo ===\n');

console.log('Creating master resume template:');
console.log('-'.repeat(35));

const masterResume = new Resume();
masterResume.setName('John Doe');
masterResume.addExperience('Tech Corp', 'Senior Developer', 3);
masterResume.addExperience('StartupXYZ', 'Full Stack Developer', 2);
masterResume.addSkill('JavaScript');
masterResume.addSkill('React');
masterResume.addSkill('Node.js');

masterResume.display();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Cloning resume for different applications:');
console.log('-'.repeat(45));

// Clone for frontend position
const frontendResume = masterResume.clone();
frontendResume.setName('John Doe - Frontend Specialist');
frontendResume.addSkill('Vue.js');
frontendResume.addSkill('CSS/SASS');

console.log();
frontendResume.display();

console.log('\n' + '-'.repeat(30) + '\n');

// Clone for backend position
const backendResume = masterResume.clone();
backendResume.setName('John Doe - Backend Engineer');
backendResume.addExperience('DataCorp', 'Backend Specialist', 1);
backendResume.addSkill('Python');
backendResume.addSkill('PostgreSQL');

console.log();
backendResume.display();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Creating and cloning cover letters:');
console.log('-'.repeat(35));

const masterCoverLetter = new CoverLetter('TechCompany', 'Software Engineer', 'modern');
masterCoverLetter.addParagraph(
  'I am writing to express my strong interest in the Software Engineer position...',
);
masterCoverLetter.addParagraph('With over 5 years of experience in software development...');
masterCoverLetter.addParagraph('I am particularly excited about this opportunity because...');

masterCoverLetter.display();

console.log('\n' + '-'.repeat(30) + '\n');

// Clone for different companies
const googleCoverLetter = masterCoverLetter.clone();
googleCoverLetter.setRecipient('Google', 'Senior Software Engineer');

console.log();
googleCoverLetter.display();
```

## 🌟 Real-World Example

### Game Character System

```javascript
// Abstract prototype for game characters
class GameCharacter {
  constructor() {
    if (this.constructor === GameCharacter) {
      throw new Error('GameCharacter is abstract and cannot be instantiated');
    }
  }

  clone() {
    throw new Error('clone() method must be implemented');
  }

  display() {
    throw new Error('display() method must be implemented');
  }
}

// Warrior character prototype
class Warrior extends GameCharacter {
  constructor(name = 'Unnamed Warrior', level = 1) {
    super();
    this.type = 'Warrior';
    this.name = name;
    this.level = level;
    this.health = 100 + level * 10;
    this.strength = 15 + level * 2;
    this.defense = 12 + level * 1.5;
    this.weapons = ['Iron Sword'];
    this.armor = ['Leather Armor'];
    this.skills = ['Sword Strike', 'Shield Block'];
    this.experience = level * 100;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  clone() {
    console.log(`⚔️ Cloning warrior: ${this.name} (Level ${this.level})`);

    const cloned = new Warrior(this.name, this.level);

    // Deep copy arrays and objects
    cloned.weapons = [...this.weapons];
    cloned.armor = [...this.armor];
    cloned.skills = [...this.skills];
    cloned.health = this.health;
    cloned.strength = this.strength;
    cloned.defense = this.defense;
    cloned.experience = this.experience;

    // Generate new ID
    cloned.id = Math.random().toString(36).substr(2, 9);

    console.log(`✅ Warrior cloned with ID: ${cloned.id}`);
    return cloned;
  }

  levelUp() {
    this.level++;
    this.health += 10;
    this.strength += 2;
    this.defense += 1.5;
    this.experience += 100;
    console.log(`📈 ${this.name} leveled up to ${this.level}!`);
  }

  addWeapon(weapon) {
    this.weapons.push(weapon);
    console.log(`⚔️ ${this.name} acquired: ${weapon}`);
  }

  addSkill(skill) {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
      console.log(`🎯 ${this.name} learned: ${skill}`);
    }
  }

  display() {
    console.log(`⚔️ Warrior Character:`);
    console.log(`   ID: ${this.id}`);
    console.log(`   Name: ${this.name}`);
    console.log(`   Level: ${this.level}`);
    console.log(`   Health: ${this.health}`);
    console.log(`   Strength: ${this.strength}`);
    console.log(`   Defense: ${this.defense}`);
    console.log(`   Weapons: ${this.weapons.join(', ')}`);
    console.log(`   Armor: ${this.armor.join(', ')}`);
    console.log(`   Skills: ${this.skills.join(', ')}`);
    console.log(`   Experience: ${this.experience}`);
  }
}

// Mage character prototype
class Mage extends GameCharacter {
  constructor(name = 'Unnamed Mage', level = 1) {
    super();
    this.type = 'Mage';
    this.name = name;
    this.level = level;
    this.health = 70 + level * 7;
    this.mana = 100 + level * 15;
    this.intelligence = 18 + level * 3;
    this.defense = 8 + level * 1;
    this.spells = ['Magic Missile', 'Heal'];
    this.staff = 'Wooden Staff';
    this.robes = ['Apprentice Robes'];
    this.spellbooks = ['Basic Magic'];
    this.experience = level * 100;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  clone() {
    console.log(`🔮 Cloning mage: ${this.name} (Level ${this.level})`);

    const cloned = new Mage(this.name, this.level);

    // Deep copy arrays and properties
    cloned.spells = [...this.spells];
    cloned.robes = [...this.robes];
    cloned.spellbooks = [...this.spellbooks];
    cloned.health = this.health;
    cloned.mana = this.mana;
    cloned.intelligence = this.intelligence;
    cloned.defense = this.defense;
    cloned.staff = this.staff;
    cloned.experience = this.experience;

    // Generate new ID
    cloned.id = Math.random().toString(36).substr(2, 9);

    console.log(`✅ Mage cloned with ID: ${cloned.id}`);
    return cloned;
  }

  levelUp() {
    this.level++;
    this.health += 7;
    this.mana += 15;
    this.intelligence += 3;
    this.defense += 1;
    this.experience += 100;
    console.log(`📈 ${this.name} leveled up to ${this.level}!`);
  }

  learnSpell(spell) {
    if (!this.spells.includes(spell)) {
      this.spells.push(spell);
      console.log(`✨ ${this.name} learned spell: ${spell}`);
    }
  }

  acquireSpellbook(book) {
    this.spellbooks.push(book);
    console.log(`📚 ${this.name} acquired spellbook: ${book}`);
  }

  display() {
    console.log(`🔮 Mage Character:`);
    console.log(`   ID: ${this.id}`);
    console.log(`   Name: ${this.name}`);
    console.log(`   Level: ${this.level}`);
    console.log(`   Health: ${this.health}`);
    console.log(`   Mana: ${this.mana}`);
    console.log(`   Intelligence: ${this.intelligence}`);
    console.log(`   Defense: ${this.defense}`);
    console.log(`   Staff: ${this.staff}`);
    console.log(`   Spells: ${this.spells.join(', ')}`);
    console.log(`   Robes: ${this.robes.join(', ')}`);
    console.log(`   Spellbooks: ${this.spellbooks.join(', ')}`);
    console.log(`   Experience: ${this.experience}`);
  }
}

// Character factory using prototypes
class CharacterFactory {
  constructor() {
    this.prototypes = new Map();
  }

  registerPrototype(key, prototype) {
    this.prototypes.set(key, prototype);
    console.log(`📝 Registered prototype: ${key} (${prototype.type})`);
  }

  createCharacter(key, customizations = {}) {
    if (!this.prototypes.has(key)) {
      throw new Error(`Prototype '${key}' not found`);
    }

    console.log(`🏭 Creating character from prototype: ${key}`);
    const prototype = this.prototypes.get(key);
    const character = prototype.clone();

    // Apply customizations
    Object.keys(customizations).forEach((prop) => {
      if (character.hasOwnProperty(prop)) {
        character[prop] = customizations[prop];
        console.log(`🎨 Customized ${prop}: ${customizations[prop]}`);
      }
    });

    return character;
  }

  listPrototypes() {
    console.log('📋 Available Prototypes:');
    this.prototypes.forEach((prototype, key) => {
      console.log(`   ${key}: ${prototype.type} (Level ${prototype.level})`);
    });
  }
}

// Usage
console.log('\n=== Game Character Prototype Demo ===\n');

// Create prototype characters
console.log('Creating prototype characters:');
console.log('-'.repeat(30));

const warriorPrototype = new Warrior('Template Warrior', 5);
warriorPrototype.addWeapon('Steel Sword');
warriorPrototype.addWeapon('Battle Axe');
warriorPrototype.addSkill('Berserker Rage');
warriorPrototype.levelUp();

const magePrototype = new Mage('Template Mage', 4);
magePrototype.learnSpell('Fireball');
magePrototype.learnSpell('Lightning Bolt');
magePrototype.acquireSpellbook('Advanced Elementals');
magePrototype.levelUp();

console.log('\n' + '='.repeat(50) + '\n');

// Setup character factory
console.log('Setting up character factory:');
console.log('-'.repeat(30));

const factory = new CharacterFactory();
factory.registerPrototype('elite-warrior', warriorPrototype);
factory.registerPrototype('elite-mage', magePrototype);

factory.listPrototypes();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Creating characters from prototypes:');
console.log('-'.repeat(40));

// Create customized characters from prototypes
const playerWarrior = factory.createCharacter('elite-warrior', {
  name: 'Sir Lancelot',
  level: 8,
});

console.log();
playerWarrior.display();

console.log('\n' + '-'.repeat(30) + '\n');

const playerMage = factory.createCharacter('elite-mage', {
  name: 'Gandalf',
  level: 10,
  staff: 'Staff of Power',
});

console.log();
playerMage.display();

console.log('\n' + '-'.repeat(30) + '\n');

// Create multiple NPCs quickly
console.log('Creating NPC army:');
console.log('-'.repeat(18));

const npcWarriors = [];
for (let i = 1; i <= 3; i++) {
  const npc = factory.createCharacter('elite-warrior', {
    name: `Guard ${i}`,
    level: 3 + i,
  });
  npcWarriors.push(npc);
}

npcWarriors.forEach((npc) => {
  console.log(`🛡️ ${npc.name} - Level ${npc.level} - Health: ${npc.health}`);
});
```

## 🔧 Another Simple Example

### Configuration Templates

```javascript
// Prototype for application configurations
class AppConfig {
  constructor() {
    this.database = {
      host: 'localhost',
      port: 5432,
      name: 'myapp',
      ssl: false,
    };
    this.server = {
      port: 3000,
      host: 'localhost',
      cors: true,
    };
    this.logging = {
      level: 'info',
      file: './logs/app.log',
      console: true,
    };
    this.cache = {
      enabled: false,
      ttl: 3600,
      provider: 'redis',
    };
    this.features = [];
    this.environment = 'development';
    this.created = new Date();
  }

  clone() {
    console.log(`⚙️ Cloning configuration for: ${this.environment}`);

    const cloned = new AppConfig();

    // Deep copy all configuration objects
    cloned.database = { ...this.database };
    cloned.server = { ...this.server };
    cloned.logging = { ...this.logging };
    cloned.cache = { ...this.cache };
    cloned.features = [...this.features];
    cloned.environment = this.environment;
    cloned.created = new Date();

    console.log(`✅ Configuration cloned for: ${cloned.environment}`);
    return cloned;
  }

  setEnvironment(env) {
    this.environment = env;
    console.log(`🌍 Environment set to: ${env}`);
  }

  enableFeature(feature) {
    if (!this.features.includes(feature)) {
      this.features.push(feature);
      console.log(`🎯 Feature enabled: ${feature}`);
    }
  }

  updateDatabase(options) {
    this.database = { ...this.database, ...options };
    console.log(`💾 Database config updated:`, options);
  }

  display() {
    console.log(`⚙️ App Configuration [${this.environment.toUpperCase()}]:`);
    console.log(`   Database: ${this.database.host}:${this.database.port}/${this.database.name}`);
    console.log(`   Server: ${this.server.host}:${this.server.port}`);
    console.log(`   Logging: ${this.logging.level} → ${this.logging.file}`);
    console.log(
      `   Cache: ${this.cache.enabled ? 'Enabled' : 'Disabled'} (${this.cache.provider})`,
    );
    console.log(`   Features: ${this.features.join(', ') || 'None'}`);
    console.log(`   Created: ${this.created.toLocaleString()}`);
  }
}

// Usage
console.log('\n=== Configuration Prototype Demo ===\n');

console.log('Creating base configuration:');
console.log('-'.repeat(30));

const baseConfig = new AppConfig();
baseConfig.enableFeature('user-authentication');
baseConfig.enableFeature('email-notifications');
baseConfig.display();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Creating environment-specific configs:');
console.log('-'.repeat(40));

// Development config
const devConfig = baseConfig.clone();
devConfig.setEnvironment('development');
devConfig.updateDatabase({ host: 'localhost', ssl: false });
devConfig.enableFeature('debug-mode');
devConfig.enableFeature('hot-reload');

console.log();
devConfig.display();

console.log('\n' + '-'.repeat(30) + '\n');

// Production config
const prodConfig = baseConfig.clone();
prodConfig.setEnvironment('production');
prodConfig.updateDatabase({
  host: 'prod-db.company.com',
  ssl: true,
  port: 5433,
});
prodConfig.server.port = 8080;
prodConfig.server.host = '0.0.0.0';
prodConfig.logging.level = 'error';
prodConfig.cache.enabled = true;

console.log();
prodConfig.display();

console.log('\n' + '-'.repeat(30) + '\n');

// Staging config
const stagingConfig = prodConfig.clone();
stagingConfig.setEnvironment('staging');
stagingConfig.updateDatabase({ host: 'staging-db.company.com' });
stagingConfig.logging.level = 'warn';
stagingConfig.enableFeature('performance-monitoring');

console.log();
stagingConfig.display();
```

## ✅ Pros

- **Performance**: Avoids expensive object creation operations
- **Flexibility**: Can create objects dynamically at runtime
- **Reduced Subclassing**: Alternative to creating many subclasses
- **Configuration**: Easy to create pre-configured object templates
- **Independence**: Cloned objects are independent of their prototypes

## ❌ Cons

- **Deep Copying Complexity**: Implementing deep cloning can be complex
- **Circular References**: Issues with objects that reference each other
- **Memory Usage**: May keep references to large prototype objects
- **Clone Method Maintenance**: Must maintain clone methods in all classes

## 🎯 When to Use

- **Expensive Object Creation**: When creating objects is costly (database connections, file operations)
- **Complex Configuration**: Objects require extensive setup or configuration
- **Runtime Object Creation**: Object types are determined at runtime
- **Template Objects**: Need to create many similar objects with slight variations
- **Avoiding Subclassing**: Alternative to creating many subclasses for similar objects

## 🔄 Types of Cloning

### 1. **Shallow Copy**

- Copies object properties but not nested objects
- Faster but shares references to nested objects

### 2. **Deep Copy**

- Recursively copies all nested objects
- Slower but creates completely independent objects

```javascript
// Shallow copy example
shallowClone() {
  return Object.assign({}, this);
}

// Deep copy example (for simple objects)
deepClone() {
  return JSON.parse(JSON.stringify(this));
}

// Custom deep copy with proper handling
customDeepClone() {
  const cloned = new this.constructor();
  // Copy primitive properties
  Object.keys(this).forEach(key => {
    if (typeof this[key] !== 'object' || this[key] === null) {
      cloned[key] = this[key];
    } else if (Array.isArray(this[key])) {
      cloned[key] = [...this[key]];
    } else {
      cloned[key] = { ...this[key] };
    }
  });
  return cloned;
}
```

## 🔗 Related Patterns

- **Factory Method**: Both create objects, but Prototype clones existing instances while Factory Method creates new instances
- **Abstract Factory**: Can use Prototype to store and clone product prototypes
- **Singleton**: Opposite approach - Prototype creates many instances while Singleton ensures only one
- **Builder**: Both handle complex object creation, but Builder constructs step-by-step while Prototype clones existing objects

## 📚 Further Reading

- [Prototype Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/prototype)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Object Cloning Techniques](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
