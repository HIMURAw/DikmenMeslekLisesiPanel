const { MongoClient } = require('mongodb');

async function check() {
  const uri = "mongodb+srv://dikmenmtal:sGh2ktUY59kpPyvO@cluster0.mqmpsdo.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test'); // mongoose usually uses 'test' if not specified in URI, or extracts it. 
    // In the URI provided previously: ...cluster0.mqmpsdo.mongodb.net/?appName=Cluster0 
    // It doesn't have a DB name, so mongoose defaults to 'test'.
    // Actually, in lib/mongodb.ts I didn't specify a DB name, so it uses the default one.
    
    // Let's try to find which databases exist or just check 'test' and 'dikmen_mtal'.
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));
    
    const dbName = dbs.databases.find(d => d.name === 'dikmen_mtal') ? 'dikmen_mtal' : 'test';
    const collection = client.db(dbName).collection('schooldatas');
    const count = await collection.countDocuments();
    console.log(`Documents in ${dbName}.schooldatas: ${count}`);
  } finally {
    await client.close();
  }
}

check().catch(console.dir);
