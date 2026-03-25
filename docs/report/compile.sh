#!/bin/bash
# Run from docs/report/
set -e
echo "Compiling SE Micro Project Report..."
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex   # second pass: TOC, labels
echo "Done. Output: docs/report/main.pdf"
