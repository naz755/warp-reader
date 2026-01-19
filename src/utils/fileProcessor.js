/**
 * File Processor Utility
 * 
 * Handles reading and text extraction from various file formats:
 * - Plain text (.txt)
 * - PDF documents (.pdf) using pdf.js
 * - Word documents (.docx) using mammoth
 * 
 * Usage:
 *   import { processFile } from './utils/fileProcessor';
 *   const text = await processFile(file);
 */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import logger from './logger';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/**
 * Process a file and extract its text content
 * Automatically detects file type and uses appropriate extraction method
 * 
 * @param {File} file - The file object to process
 * @returns {Promise<string>} Extracted text content
 * @throws {Error} If file type is unsupported or processing fails
 */
export const processFile = async (file) => {
    logger.log('File Upload Detected ->', file.name);

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
        return await processPDF(file);
    } else if (fileName.endsWith('.docx')) {
        return await processDOCX(file);
    } else if (fileName.endsWith('.txt')) {
        return await processTXT(file);
    } else {
        // Try to read as plain text for unknown extensions
        return await processTXT(file);
    }
};

/**
 * Extract text from a PDF file using pdf.js
 * Maintains reading order by sorting text items by position
 * 
 * @param {File} file - PDF file to process
 * @returns {Promise<string>} Extracted text
 */
const processPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            // Sort items by position to maintain reading order
            const items = content.items.sort((a, b) => {
                // Sort by Y position (top to bottom), then X position (left to right)
                if (Math.abs(a.transform[5] - b.transform[5]) > 3) {
                    return b.transform[5] - a.transform[5];
                }
                return a.transform[4] - b.transform[4];
            });

            fullText += items.map(item => item.str).join(' ') + ' ';
        }

        logger.log('PDF processed successfully, pages:', pdf.numPages);
        return fullText;
    } catch (error) {
        logger.error('PDF Error:', error);
        throw new Error('Error reading PDF file');
    }
};

/**
 * Extract text from a DOCX file using mammoth
 * 
 * @param {File} file - DOCX file to process
 * @returns {Promise<string>} Extracted text
 */
const processDOCX = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        logger.log('DOCX processed successfully');
        return result.value;
    } catch (error) {
        logger.error('DOCX Error:', error);
        throw new Error('Error reading DOCX file');
    }
};

/**
 * Read a plain text file
 * 
 * @param {File} file - Text file to process
 * @returns {Promise<string>} File contents as string
 */
const processTXT = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            logger.log('Text file processed successfully');
            resolve(e.target.result);
        };

        reader.onerror = () => {
            logger.error('Text file read error');
            reject(new Error('Error reading text file'));
        };

        reader.readAsText(file);
    });
};

export default {
    processFile,
};
