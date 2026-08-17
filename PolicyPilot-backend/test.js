const { MilvusClient } = require('@zilliz/milvus2-sdk-node');
const util = require('util');
require('dotenv').config();

// 配置信息（全部来自环境变量，勿在仓库中硬编码主机地址）
const MILVUS_HOST = process.env.MILVUS_HOST || 'localhost';
const MILVUS_PORT = process.env.MILVUS_PORT || '19530';
const DB_NAME = process.env.MILVUS_DB || process.env.DB_NAME || 'govpolicy';
const COLLECTION_NAME = process.env.MILVUS_COLLECTION || 'govpolicy';
const VECTOR_FIELD = 'embedding';
const SEARCH_PARAMS = {
  anns_field: 'embedding',
  metric_type: 'IP',
  params: {
    nprobe: 32,
    radius: 0.8
  }
};

if (!process.env.MILVUS_HOST) {
  console.warn(
    '[test.js] MILVUS_HOST 未设置，默认使用 localhost。请在 PolicyPilot-backend/.env 中配置真实地址。'
  );
}

// 自定义日志函数
function logger() {
  return {
    info: (message, ...args) => console.log(`${new Date().toISOString()} - INFO - ${util.format(message, ...args)}`),
    error: (message, ...args) => console.error(`${new Date().toISOString()} - ERROR - ${util.format(message, ...args)}`)
  };
}

async function simulateJsSearch(keywords) {
  const log = logger();
  console.log("SDK版本:", require('./package.json').dependencies['@zilliz/milvus2-sdk-node']);
  const client = new MilvusClient({
    address: `${MILVUS_HOST}:${MILVUS_PORT}`,
    database: DB_NAME
  });
  

  try {
    // 1. 连接验证
    log.info("[1/7] 连接成功 | DB: %s", DB_NAME);
    const dbs = await client.listDatabases();
    console.log("数据库列表:", dbs.db_names);
    console.log("当前数据库:", dbs.current_db);

    // 2. 检查集合存在
    const hasCollection = await client.hasCollection({ collection_name: COLLECTION_NAME });
    if (!hasCollection.value) {
      throw new Error(`Collection ${COLLECTION_NAME} not found`);
    }
    log.info("[2/7] 集合存在验证通过");

    // 3. 加载集合
    await client.loadCollection({ collection_name: COLLECTION_NAME });
    log.info("[3/7] 集合加载完成");

    // 4. 构建过滤表达式
    let expr = "";
    if (keywords && keywords.length > 0) {
      expr = keywords.map(k => `doc_title LIKE "%${k}%"`).join(" OR ");
      log.info("[4/7] 生成过滤表达式: %s", expr);
    } else {
      log.info("[4/7] 无关键词过滤");
    }

    // 5. 生成随机向量
    const testVector = Array.from({ length: 384 }, () => Math.random());
    log.info("[5/7] 生成测试向量完成（维度 %d）", testVector.length);

    // 6. 执行搜索
    const searchRequest = {
      collection_name: COLLECTION_NAME,
      vectors: [testVector],
      filter: expr,
      output_fields: ["doc_title", "pub_url"],
      limit: 15,
      params: SEARCH_PARAMS.params,
      anns_field: SEARCH_PARAMS.anns_field,
      metric_type: SEARCH_PARAMS.metric_type
    };

    log.info("[6/7] 发送搜索请求，参数: %j", searchRequest);
    const result = await client.search(searchRequest);
    log.info("[7/7] 搜索完成，结果数: %d", result.results.length);

    // 调试信息
    await logCollectionInfo(client, log);
    logSearchResults(result, log);

    return result;
  } catch (error) {
    log.error("测试失败: %s", error.message);
    await logDebugInfo(client, log);
    throw error;
  } finally {
    await client.closeConnection();
  }
}

// 辅助函数：记录集合信息
async function logCollectionInfo(client, log) {
  try {
    const desc = await client.describeCollection({ collection_name: COLLECTION_NAME });
    log.info("==== 集合结构 ====");
    desc.schema.fields.forEach(field => {
      log.info("字段: %-12s | 类型: %-8s | 主键: %s",
        field.name,
        field.data_type,
        field.is_primary_key);
    });
  } catch (error) {
    log.error("获取集合信息失败: %s", error.message);
  }
}

// 辅助函数：记录搜索结果
function logSearchResults(result, log) {
  log.info("==== 搜索结果 ====");
  result.results.slice(0, 5).forEach((hit, index) => {
    const entity = hit.entity || {};
    log.info("结果 #%d | 分数: %.3f", index + 1, hit.score);
    log.info("标题: %s", entity.doc_title || "无");
    log.info("链接: %s\n", entity.pub_url || "无");
  });
}

// 辅助函数：记录调试信息
async function logDebugInfo(client, log) {
  try {
    log.info("==== 调试信息 ====");
    const collections = await client.listCollections();
    log.info("集合列表: %j", collections);

    if ((await client.hasCollection({ collection_name: COLLECTION_NAME })).value) {
      const desc = await client.describeCollection({ collection_name: COLLECTION_NAME });
      log.info("字段信息: %j", desc.schema.fields);
      const indexes = await client.listIndexes({ collection_name: COLLECTION_NAME });
      log.info("索引信息: %j", indexes);
    }
  } catch (error) {
    log.error("获取调试信息失败: %s", error.message);
  }
}

// 执行测试
(async () => {
  try {
    await simulateJsSearch(["小公司", "政策"]);
  } catch (error) {
    console.error("测试运行失败:", error);
  }
})();