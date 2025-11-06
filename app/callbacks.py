from dash.dependencies import Input, Output

def register_callbacks(app):
    @app.callback(
        Output('graph', 'figure'),
        Input('dropdown', 'value')
    )
    def update_graph(selected):
        # Placeholder: empty figure
        return {
            'data': [],
            'layout': {
                'title': 'Graph will display here'
            }
        }