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
    # we want the time to tend closer to 1-3 seconds with some outliers
    # that are longer
    wait_type = random.randint(0, 10)
    if wait_type < 3:
        wait_time = random.randint(2, 8)
    elif wait_type < 9:
        wait_time = random.randint(2, 6)
    else:
        wait_time = random.randint(7, 35)

    await asyncio.sleep(wait_time)
    return text
