import click


@click.group()
def cli():
    pass


@cli.command()
@click.argument('directory')
@click.option('--app', default='app')
def new(directory, app):
    click.echo(directory)
    click.echo(app)


@cli.group()
def gen():
    pass


@gen.command()
@click.argument('module')
@click.argument('table')
@click.argument('fields')
def model(module, table, fields):
    click.echo(fields)


cli()
