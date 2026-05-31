# Cost Analysis: MoveMate Predictive Maintenance

This document outlines the projected monthly costs for running the Grade 5 Predictive Maintenance pipeline in a production environment serving 500 moving trucks.

## 1. Infrastructure (AWS)
- **EC2 Instances (FastAPI + Celery Workers):** 2x t3.medium = ~$60/month
- **Managed Database (RDS Postgres + Timescale):** db.t3.large = ~$120/month
- **ElastiCache (Redis):** cache.t3.micro = ~$15/month
- **IoT Core (MQTT Broker):** 500 trucks * 1 msg/min = 21.6M messages = ~$25/month
*Subtotal: $220/month*

## 2. Artificial Intelligence (OpenAI / LangChain)
- **Anomaly Detection & Reporting:** Assuming 5% of trucks experience an anomaly per month requiring a RAG-generated report.
- 25 reports * ~1,000 tokens per prompt (GPT-4o) = ~$0.15/month
*Subtotal: ~$1.00/month*

## 3. Frontend Hosting (Vercel)
- **Next.js Hosting (Pro Plan):** $20/month
*Subtotal: $20/month*

## **Total Projected Production Cost: ~$241 / month**

### ROI Justification
A single engine failure on a fully-loaded moving truck on the highway results in:
- Towing costs: $500 - $1,000
- Delayed customer delivery penalties: $200+
- Repair costs: $2,000+
By preventing just **one** critical failure per month using the ML Remaining Useful Life (RUL) model, the system achieves a 10x ROI.
