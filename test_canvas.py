import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, Preformatted
)
from reportlab.pdfgen import canvas
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

# -----------------------------------------------------------------------------
# TWO-PASS NUMBERED CANVAS FOR EXACT REPORTLAB PAGINATION
# -----------------------------------------------------------------------------
class ProjectReportCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        p = self._pageNumber
        # Pages 1 to 3: No page numbers (Cover, Bonafide, Viva-voce)
        if p in [1, 2, 3]:
            return
        # Pages 4 to 9: Roman numerals centered at bottom
        elif 4 <= p <= 9:
            roman_map = {4: "i", 5: "ii", 6: "iii", 7: "iv", 8: "v", 9: "vi"}
            num_str = roman_map.get(p, "")
            self.saveState()
            self.setFont("Times-Roman", 11)
            self.drawCentredString(306, 36, num_str)
            self.restoreState()
        # Pages 10 to 48: Arabic numerals 1 to 39 centered at bottom
        elif p >= 10:
            num_str = str(p - 9)
            self.saveState()
            self.setFont("Times-Roman", 11)
            self.drawCentredString(306, 36, num_str)
            self.restoreState()

print("Canvas class prepared.")
