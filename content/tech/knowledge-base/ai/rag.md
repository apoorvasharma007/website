+++
title = "Retrieval-Augmented Generation"
weight = 2
date = "2026-04-29"
tags = ["ai", "rag", "retrieval"]
+++

RAG extends a language model's knowledge by retrieving relevant documents at inference time and including them in the context window.

![RAG pipeline](/diagrams/rag-pipeline.svg)

## The Basic Pipeline

1. Index documents into a vector store (embed each chunk, store embedding + text)
2. At query time, embed the user's question and retrieve the top-k most similar chunks
3. Pass the retrieved chunks + query to the model as context

```python
# Simplified RAG pipeline
def rag_query(query: str, vector_store, llm, k: int = 5) -> str:
    # Step 1: retrieve
    query_embedding = embed(query)
    chunks = vector_store.search(query_embedding, top_k=k)

    # Step 2: build context
    context = "\n\n".join(chunk.text for chunk in chunks)

    # Step 3: generate
    prompt = f"""Answer the question using only the context below.
If the context doesn't contain the answer, say so.

Context:
{context}

Question: {query}
Answer:"""
    return llm.complete(prompt)
```

## Chunking Strategy

Chunk size matters. Too small: chunks lose context. Too large: irrelevant content dilutes the relevant. 256–512 tokens with overlap (50–100 tokens) is a common starting point.

| Strategy | Chunk size | Overlap | Good for |
|---|---|---|---|
| Fixed token | 256–512 | 50–100 | General purpose |
| Sentence | ~1–3 sentences | 1 sentence | High-precision retrieval |
| Paragraph | ~200–400 tokens | None | Narrative/prose documents |
| Recursive | Variable | Variable | Mixed-structure documents |

Overlap prevents splitting a relevant sentence across chunk boundaries.

## Embedding models

The quality of retrieval depends heavily on the embedding model.

- **OpenAI text-embedding-3-small/large** — strong baseline, hosted
- **sentence-transformers (BAAI/bge-m3)** — strong open-source option, multilingual
- **Cohere embed-v3** — high-quality with reranking support

Use a model that was trained on data similar to your domain. A general-purpose embedding model may perform poorly on legal, medical, or code-heavy corpora.

## Improving retrieval quality

### Hybrid search

Combine dense (vector) search with sparse (BM25/keyword) search. Dense search handles semantic similarity; sparse search handles exact keyword matches. A reranker then scores the merged results.

### Reranking

After retrieving top-k chunks, a cross-encoder reranker scores each chunk against the query more precisely than the embedding similarity allows. Adds latency but improves precision significantly.

```
Initial retrieval: top-20 chunks by vector similarity
Reranker: score each of 20 chunks against query
Final context: top-5 chunks by reranker score
```

### Query transformation

The user's raw query may not match the language of the documents. Rewrite it before embedding:

- Expand abbreviations or jargon
- Generate multiple query phrasings and retrieve for all
- Use HyDE (Hypothetical Document Embeddings): generate a hypothetical answer, embed it, use that embedding to retrieve

## When RAG Beats Fine-Tuning

| Scenario | RAG | Fine-tuning |
|---|---|---|
| Knowledge changes frequently | ✓ (no retraining) | ✗ (requires retraining) |
| Need citations/provenance | ✓ (chunks are attributable) | ✗ |
| Task-specific style/format | ✗ | ✓ |
| Domain-specific reasoning | Sometimes | ✓ |
| Large, sparse knowledge base | ✓ | ✗ (all knowledge in weights) |

RAG and fine-tuning are complementary. Fine-tune for the task shape; use RAG for the knowledge.
