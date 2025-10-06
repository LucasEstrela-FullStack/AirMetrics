import cartopy.crs as ccrs
import earthaccess
import matplotlib.pyplot as plt
import numpy as np
import xarray as xr
from matplotlib import rcParams

%config InlineBackend.figure_format = 'jpeg'
rcParams["figure.dpi"] = (
    80  # Reduce figure resolution to keep the saved size of this notebook low.
)

auth = earthaccess.login()

if not auth.authenticated:
    # Ask for credentials and persist them in a .netrc file.
    auth.login(strategy="interactive", persist=True)

print(earthaccess.__version__)