// namespace
var CSV = CSV || {};

CSV.Reader = function(csvText, delimiter) {

   // if we have no delimiter specified, assume tab
   if (!delimiter) {
      delimiter = "\t";
   }

   // check to see if the delimiter exists in the text
   if (csvText.indexOf(delimiter) == -1) {
      console.error("The CSV input isn't delimited by the given delimiter (if none was given, it is a tab)");
      return;
   }

   // parse each line of the csvText
   var lines = csvText.split("\n");

   // basic validation
   if (lines.length <= 1) {
      console.error("The CSV input doesn't appear to be valid - it does not have enough lines.");
      return;
   }

   var currentLine = null;
   var currentRow = [];
   this.columns = [];
   this.columnIndexes = [];
   this.rows = [];
   this.currentRowIndex = 0;

   // loop through all lines
   for (var i = 0; i < lines.length; i++) {
      // break apart the current line
      currentLine = lines[i].split(delimiter);

      // this is the first line, so we'll create the columns list with it
      if (i == 0) {

         for (var j = 0; j < currentLine.length; j++) {
            this.columns.push(currentLine[j]);
            this.columnIndexes[currentLine[j]] = j;
         }

      } else {
         console.log("pushed a new line, count is " + i);
         this.rows.push(currentLine);
      }
   }
   
   this.rowCount = function() {
      // we have to subract 1 because the first row has column headers
      return lines.length - 1;
   }

   this.columnExists = function(columnName) {
      return (!this.columnIndexes[columnName] ? false : true);
   }

   this.getValue = function(columnName) {
      if (this.columnIndexes[columnName] == null) {
         console.error("Invalid column name: " + columnName);
      }

      return this.rows[this.currentRowIndex][this.columnIndexes[columnName]];
   }

   this.moveNext = function() {
      this.currentRowIndex++;
   }

   this.reset = function() {
      this.currentRowIndex = 0;
   }

}

CSV.Document = function(delimiter) {

   if (!delimiter) {
      delimiter = "\t";
   }

   this.documentString = "";
   this.currentLine = "";

   this.setColumnsFromArray = function(columnArray) {
      // TODO: if we already have lines, let's error out, since we don't want to set columns
      // unless we're starting the document
      
      for (var i = 0; i < columnArray.length; i++) {

         this.documentString += columnArray[i];

         if (i == columnArray.length - 1) {
            this.documentString += "\n"; // at the end of the line
            this.currentLine = null;
         } else {
            this.documentString += delimiter;
         }
      }

   }

   this.appendToLine = function(value) {
      if (this.currentLine == null) {
         this.currentLine = value;
      } else {
         this.currentLine += delimiter + value;
      }
   }

   this.appendToLineFromArray = function(lineArray) {

      // TODO: validation to check to see if the current line is done or not

      for (var i = 0; i < lineArray.length; i++) {
         this.currentLine += lineArray[i];

         if (i == lineArray.length - 1) {
            this.currentLine += "\n";
         } else {
            this.currentLine += delimiter;
         }
      }

      this.documentString += this.currentLine;

   }

   this.finishLine = function() {
      this.currentLine += "\n";
      this.documentString += this.currentLine;
      this.currentLine = null;
   }

   this.toString = function() {
      return this.documentString;
   }
}
