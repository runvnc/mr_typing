from lib.providers.commands import command
import asyncio
import random

random.seed()

@command()
async def say(text, context=None):
    """
    Say something to the user or chat room, but only show a typing indicator until complete.
    
    Parameters:
    text - String. The text to say.
    
    Return: No return value.
    """
    # create a random delay to simulate a human response
    wait_time = random.randint(1, 5)
    await asyncio.sleep(wait_time)
    return text
