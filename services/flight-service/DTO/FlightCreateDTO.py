class FlightCreateDTO:
    def __init__(self,data:dict):
        self.name= data['name']
        self.airCompanyId = data['airCompanyId']
        self.flightDuration = data['flightDuration']
        self.currentFlightDuration = data['currentFlightDuration']
        self.departureTime = data['departureTime']
        self.departureAirport = data['departureAirport']
        self.arrivalAirport = data['arrivalAirport']
        self.ticketPrice = data['ticketPrice']
        self.createdBy = data['createdBy']
