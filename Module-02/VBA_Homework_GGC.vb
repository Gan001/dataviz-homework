Sub stockDataCalc():

    'Perform all actions on all wooksheets
    For Each ws In Worksheets
    
        ' Declare variables
        Dim currentTicker As String ' current ticker symbol
        Dim rowOpen As Long ' to iterate through open column
        Dim rowTicker As Long ' to update to unique ticker
        Dim rowLast As Long ' to hold value of last row of total data
        Dim rowLastCalc As Long 'to to hold value of last row of unique ticker data
        Dim sum As Double   ' total volume
        Dim Start As Double ' open value
        Dim Finish As Double ' close value
        Dim Result As Double ' yearly change
        Dim Percent As Double ' percent change
        Dim MaxValue As Double ' greatest % increase
        Dim MinValue As Double ' greatest % decrease
        Dim MaxVol As Double ' greatest total volume
        Dim ticker As String ' ticker symbol

        rowTicker = 1 ' Set value for ticker iterator
        rowOpen = 2 ' Set value for open column iterator
        sum = 0

        ' Read last row of ticker column
        rowLast = ws.Cells(Rows.Count, 1).End(xlUp).Row

        ' Set headers
        ws.Cells(1, 9).Value = "Ticker"
        ws.Cells(1, 10).Value = "Yearly Change"
        ws.Cells(1, 11).Value = "Percent Change"
        ws.Cells(1, 12).Value = "Total Stock Volume"
        ws.Cells(2, 15).Value = "Greatest % Increase"
        ws.Cells(3, 15).Value = "Greatest % Decrease"
        ws.Cells(4, 15).Value = "Greatest Total Volume"
        ws.Cells(1, 16).Value = "Ticker"
        ws.Cells(1, 17).Value = "Value"
    
        ' Loop to iterate through ticker data
        For i = 2 To rowLast
        
            ' Set current ticker
            currentTicker = ws.Cells(i, 1).Value
        
            ' Initialize open value and check for 0 value
            If ws.Cells(rowOpen, 3).Value > 0 Then
            
                Start = ws.Cells(rowOpen, 3).Value
                
            Else
                ' update to next row if 0
                rowOpen = rowOpen + 1
        
            End If
    
            ' Calculate and display all values for current ticker if next ticker is different
            If ws.Cells(i + 1, 1).Value <> currentTicker Then
            
                ' This will iterate through row
                ws.Cells(rowTicker + 1, 9).Value = ws.Cells(i, 1).Value
                ' Set closing value
                Finish = ws.Cells(i, 6).Value
            
                ' Calculate and display yearly change, check for zero value
                If Finish > 0 Then
                    ' Subtract open from close
                    Result = Finish - Start
                    ' Display result
                    ws.Cells(rowTicker + 1, 10) = Result
                
                End If
            
                ' Display result color
                If Result > 0 Then
            
                    ws.Cells(rowTicker + 1, 10).Interior.ColorIndex = 4
            
                Else
            
                    ws.Cells(rowTicker + 1, 10).Interior.ColorIndex = 3
            
                End If
            
                ' Calculate percent difference and format to two decimal places
                If Finish > 0 Then ' to avoid dividing by 0
                    ' Calculate percent changed
                    Percent = (Result / Start)
                
                    ' Display and format percent changed
                    ws.Cells(rowTicker + 1, 11).Value = Percent
                    ws.Cells(rowTicker + 1, 11).NumberFormat = "0.00%"
                
                    ' Calculate last value for total volume of current ticker
                    sum = sum + ws.Cells(i, 7).Value
                
                End If
                'sum = sum + ws.Cells(i, 7).Value
            
                ' update row for open column to next new ticker
                rowOpen = i + 1
            
                ' display total volume
                ws.Cells(rowTicker + 1, 12).Value = sum
            
                ' update ticker iterator
                rowTicker = rowTicker + 1
            
                ' clear total volume for current ticker
                sum = 0
            
            Else
         
                ' calculate total volume for same ticker
                sum = sum + ws.Cells(i, 7).Value
                   
            End If
                   
        Next i
    
        ' Read last row of new unique ticker column
        rowLastCalc = ws.Cells(Rows.Count, 9).End(xlUp).Row
    
        ' Set greatest percent to first value in percent changed column
        MaxValue = ws.Cells(2, 11).Value
    
        ' Loop to find greatest percent
        For j = 3 To rowLastCalc
    
            If ws.Cells(j, 11).Value > MaxValue Then
    
                ' Set MaxValue with current location value if it is larger than previous
                MaxValue = ws.Cells(j, 11).Value
        
                ' Set the ticker of the current largest value
                ticker = ws.Cells(j, 9).Value
    
            End If
    
        Next j
    
        'Display and format greatest percent increase and its ticker
        ws.Cells(2, 17).Value = MaxValue
        ws.Cells(2, 17).NumberFormat = "0.00%"
        ws.Cells(2, 16).Value = ticker
    
        ' Calculate greatest  percent decrease
        MinValue = ws.Cells(2, 11).Value ' Set MinValue to first value in percent changed column
    
        For k = 3 To rowLastCalc
    
            If ws.Cells(k, 11).Value < MinValue Then
        
                ' Set MinValue with current location value if it is smaller than previous
                MinValue = ws.Cells(k, 11).Value
            
                ' Set the ticker of the current smallest value
                ticker = ws.Cells(k, 9).Value
            
            End If
    
        Next k
    
        'Display and format greatest percent decrease and its ticker
        ws.Cells(3, 17).Value = MinValue
        ws.Cells(3, 17).NumberFormat = "0.00%"
        ws.Cells(3, 16).Value = ticker
    
        'Calculate greatest total volume
        MaxVol = ws.Cells(2, 12).Value ' Set MaxVol to first value in Total Stock Volume column
    
        For l = 3 To rowLastCalc
        
            If ws.Cells(l, 12).Value > MaxVol Then
        
                ' Set MaxVol with current location value if it is greater than previous
                MaxVol = ws.Cells(l, 12).Value
            
                ' Set the ticker of the current greatest value
                ticker = ws.Cells(l, 9).Value
    
            End If
    
        Next l
        'Display greatest total valume and its ticker
        ws.Cells(4, 17).Value = MaxVol
        ws.Cells(4, 16).Value = ticker

    Next ws

End Sub
