from flask import Flask, render_template, request, redirect
app = Flask(__name__, static_url_path='/static')


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/start", methods=['GET','POST'])
def start():
    form = request.form
    if 'name' in form:
        if request.form.get('name') != "":
            return render_template('start.html', name=request.form.get('name'))
        else:
            return redirect('/')
    else:
        return redirect('/')

@app.route("/begin", methods=['GET','POST'])
def begin():
    form = request.form
    return render_template('begin.html', name=request.form.get('name'), population=request.form.get('population'),
   timeperiod=request.form.get('timeperiod'), start_infected=request.form.get('start_infected'), spread_infected=request.form.get('spread_infected'))


@app.route("/stop", methods=['GET','POST'])
def stop():
    form = request.form
    return render_template('stop.html', name=request.form.get('name'), end_population=request.form.get('end-population'),
       start_population=request.form.get('start-population'), infected_population=request.form.get('infected-population'),
       dead_population=request.form.get('dead-population'),timeperiod=request.form.get('timeperiod'),start_infected=request.form.get('start_infected'),
       data=request.form.get('data'),spread_infected_rate=request.form.get('spread_infected_rate'))


@app.route("/save", methods=['GET','POST'])
def save():
    save_item = {}
    labels = []
    values = {}
    for x in request.form.get('charts').split('|'):
        values[x] = []
    colors_set = {'alive':'4,203,4', 'infected':'215, 217, 0', 'dead':'250,5,15'}
    i = 0
    form = request.form
    save_item = {'name':request.form.get('name'), 'end-population':request.form.get('end-population'),
     'start_population':request.form.get('start-population'), 'start_infected':request.form.get('start_infected'),'infected_population':request.form.get('infected-population'),
     'dead_population':request.form.get('dead-population'),'timeperiod':request.form.get('timeperiod'),
     'data': request.form.get('data'), 'spread_infected_rate': request.form.get('spread_infected_rate')}
    data = request.form.get('data').split("|")
    for x in data:
        labels.append(i)
        values['alive'].append(x.split(',')[0])
        values['infected'].append(x.split(',')[1])
        values['dead'].append(x.split(',')[2])
        i = i+1
    # save item
    return render_template('save.html', save_item=save_item, code=200,
           max=int(request.form.get('start-population')), min=int(request.form.get('end-population')),
           labels=labels, value_set=values, colors_set=colors_set)


if __name__ == "__main__":
    app.run()