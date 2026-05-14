const axios = require('axios');

async function encode(text) {
  try {
    const response = await axios.post('http://localhost:11436/api/embeddings', {
      model: 'nomic-embed-text',
      prompt: text,
      options: {
        dimensions: 384,
        gpu_layers: 32,
        embedding_only: true,
        normalize: true // 确保输出向量已归一化
      }
    });
    
    const embedding = response.data.embedding || [];
    
    // 安全处理维度
    return embedding.slice(0, 384).concat(
      Array(Math.max(384 - embedding.length, 0)).fill(0)
    );
  } catch (error) {
    console.error('嵌入生成失败:', error.response?.data || error.message);
    throw new Error('文本向量化服务不可用');
  }
}

module.exports = { encode };