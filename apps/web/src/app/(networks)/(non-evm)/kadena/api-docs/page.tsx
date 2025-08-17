'use client'

import 'swagger-ui-react/swagger-ui.css'

import SwaggerUI from 'swagger-ui-react'

import { swaggerConfig } from '~kadena/_common/lib/utils/config'

export default function ApiDocs() {
  return (
    <div className="swagger-container">
      <SwaggerUI
        spec={swaggerConfig}
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        filter={true}
      />
      <style jsx global>{`
        .swagger-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui .info {
          margin: 20px 0;
        }
        .swagger-ui .scheme-container {
          box-shadow: none;
          margin: 0;
          padding: 0;
        }
        .swagger-ui .opblock {
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        .swagger-ui .opblock .opblock-summary {
          padding: 10px;
        }
        .swagger-ui .opblock .opblock-summary-method {
          min-width: 80px;
        }
        .swagger-ui .opblock .opblock-summary-path {
          max-width: 300px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated {
          text-decoration: line-through;
        }
        .swagger-ui .opblock .opblock-summary-description {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-operation-id {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__name {
          font-size: 14px;
        }
        .swagger-ui .opblock .opblock-summary-path__method {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__url {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__summary {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__parameters {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__responses {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__security {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:hover {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:hover::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:hover::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:active {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:active::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:active::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:focus {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:focus::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:focus::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:visited {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:visited::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:visited::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:hover {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:hover::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:hover::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:active {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:active::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:active::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:focus {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:focus::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:focus::after {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:visited {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:visited::before {
          font-size: 13px;
        }
        .swagger-ui .opblock .opblock-summary-path__deprecated span:link:visited::after {
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}
