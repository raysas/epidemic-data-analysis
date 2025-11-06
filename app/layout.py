from dash import html, dcc

def create_layout():
    return html.Div(style={'fontFamily': 'Arial, sans-serif', 'padding': '20px'}, children=[
        
        # Header
        html.Div([
            html.H1("My Web Dashboard", style={'textAlign': 'center', 'color': '#333'}),
            html.P("Dashboard placeholder - data will appear here once connected to MongoDB.",
                   style={'textAlign': 'center', 'color': '#666'})
        ], style={'marginBottom': '30px'}),
        
        # Filters Row
        html.Div([
            html.Div([
                html.Label("Select Filter 1:"),
                dcc.Dropdown(
                    id='filter1-dropdown',
                    options=[],  # will fill dynamically later
                    placeholder="Choose an option"
                )
            ], style={'width': '48%', 'display': 'inline-block'}),
            
            html.Div([
                html.Label("Select Filter 2:"),
                dcc.Dropdown(
                    id='filter2-dropdown',
                    options=[],  # will fill dynamically later
                    placeholder="Choose an option"
                )
            ], style={'width': '48%', 'display': 'inline-block', 'marginLeft': '4%'})
        ], style={'marginBottom': '30px'}),
        
        # Graphs Section
        html.Div([
            dcc.Graph(
                id='graph1',
                figure={
                    'data': [],
                    'layout': {'title': 'Graph 1 - Placeholder'}
                }
            ),
            dcc.Graph(
                id='graph2',
                figure={
                    'data': [],
                    'layout': {'title': 'Graph 2 - Placeholder'}
                }
            )
        ]),
        
        # Footer
        html.Div([
            html.P("Created by Rayane Adam", style={'textAlign': 'center', 'color': '#999', 'marginTop': '50px'})
        ])
    ])
