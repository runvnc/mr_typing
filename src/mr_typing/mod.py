from lib.providers.commands import command

@command()
async def say(text, context=None):
    """
    Say something to the user or chat room, but only show a typing indicator until complete.
    
    Parameters:
    text - String. The text to say.
    
    Return: No return value.
    """
    # This command works the same as the regular say command
    # The difference is in the frontend implementation
    return text
