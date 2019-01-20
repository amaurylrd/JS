var array = ['ACDA', 'ANG', 'APL', 'ART', 'ASR', 'EC', 'EGOD', 'MAT', 'SGBD', 'SPORT'];
var helper = ['1', '2'];

//1 -> ou -> un autre classement
//2 -> et -> les deux réunis

function form_validation(form)
{
	var css = "form-control mr-sm-2";

	var item = form.elements['input_name'];
	var item_value = item.value.toUpperCase();

	form.elements[form.elements.length-1].blur();
	item.className = css+" invalid_querry";

	if (item_value === '')
		return false;
	for (let i = 0 ; i < array.length ; i++)
	{
		if (item_value.substr(callback(item_value, helper) + 1, item_value.length) == array[i])
		{
			item.className = css;

            var tmp = item.value.split(helper[0]);
            var ress = "";
            for (let j = 0 ; j < tmp.length ; j++)
            {
                if (tmp[j].includes(helper[1]))
                {
                    var tmp2 = tmp[j].split(helper[1]);
                    tmp2 = tmp2.filter(function(e, index)
                    {
                        return tmp2.indexOf(e) == index;
                    });
                    var res = "";
                    for (let k = 0 ; k < tmp2.length ; k++)
                    {
                        res = res.concat(tmp2[k]);
                        if (k != tmp2.length - 1)
                            res = res.concat(helper[1]);
                    }
                    ress = ress.concat(res);
                }
                else
                    ress = ress.concat(tmp[j]);
                if (j != tmp.length - 1)
                    ress = ress.concat(helper[0]);
            }
            tmp = ress.split(helper[0]);
            tmp = tmp.filter(function(e, index)
            {
                return tmp.indexOf(e) == index;
            });
            ress = "";
            for (let j = 0 ; j < tmp.length ; j++)
            {
                ress = ress.concat(tmp[j]);
                if (j != tmp.length - 1)
                    ress = ress.concat(helper[0]);
            }
            item.value = ress;

            return true;
		}
	}
	return false;
}

//Suggests proposals submission depending on the input 
function form_helper(item)
{
	var item_value = item.value.toUpperCase();
	var list = document.getElementsByClassName('proposal')[0];

	var input = document.getElementsByClassName('form-control')[0];
	var width = input.clientWidth;
	
	list.style.width = width+"px";
	list.style.display = "block";

	var proposal = 0;
	var fragment = document.createDocumentFragment();
	var regex = new RegExp("^"+item_value, "i");

	for (let i = 0 ; i < array.length ; i++)
    {
    	if (array[i] == item_value || 
    		(callback(item_value, helper) != -1 && array[i] == item_value.substr(callback(item_value, helper) + 1, item_value.length)))
    	{
    		fragment = document.createDocumentFragment();
    		for (let j = 0 ; j < helper.length ; j++)
    		{
    			var li = document.createElement('li');
    			li.innerHTML = helper[j];
    			li.onmousedown = function()
    			{
    				item.focus();
    				item.value = item_value.concat(helper[j]);
    				list.style.display = "none"; 
    			};
    			fragment.appendChild(li);
    			proposal++;
    		}
    		break;
    	}
    	else if (regex.test(array[i]) || callback(item_value, helper) != -1)
    	{
    		var li = document.createElement('li');
    		li.innerHTML = array[i].replace(new RegExp("^("+item_value+")","i"), '<b>$1</b>');
    		li.onmousedown = function()
    		{
    			item.focus();
    			var k = 0;
    			while (k < helper.length)
    			{
    				var pos = item_value.lastIndexOf(helper[k]);
    				if (pos != -1)
    				{
    					item.value = item_value.concat(array[i]);
    					break;
    				}
    				k++;
    			}
    			if (k == helper.length)
    				item.value = array[i];
    			list.style.display = "none";
    		};
    		fragment.appendChild(li);
    		proposal++;
    	}
    	
    }
    if (proposal != 0)
    {
    	list.innerHTML = "";
		list.appendChild(fragment);
		list.style.display = "block";
	}
	else
	{
		list.style.display = "none";
	}
}

function callback(value, seed)
{
    var locations = [];
	for (let i = 0 ; i < seed.length ; i++)
	{
		var pos = value.lastIndexOf(seed[i]);
		if (pos != -1)
            locations.push(pos);
	}

    var max = -1;
    for (let i = 0 ; i < locations.length ; i++)
    {
        if (locations[i] > max)
            max = locations[i];
    }
    
	return max;
}

function form_blur(item)
{
	var list = document.getElementsByClassName('proposal')[0];

	item.blur();
	list.style.display = "none";
}

function display(lader, tab_title)
{
    var fragment = document.createDocumentFragment();
    
    var h2 = document.createElement('h2');
    h2.innerHTML = tab_title;
    fragment.appendChild(h2);

    var table_wrapper = document.createElement('div');
    table_wrapper.className = 'table_wrapper';

    var table = document.createElement('table');
    table.className = "table";

    var thead = document.createElement('thead');
    var tr = document.createElement('tr');

    var col = ["#", "Login", "Prénom Nom"];
    for (let i = 0 ; i < col.length ; i++)
    {
        var th = document.createElement('th');
        th.setAttribute("scope", "col");
        th.innerHTML = col[i];
        tr.appendChild(th);

    }

    thead.appendChild(tr);
    table.appendChild(thead);

    for (let i = 0 ; i < lader.length ; i++)
    {
        var tr = document.createElement('tr');
        var stud = lader[i];
        var tmp = [i+1, stud.login, stud.name];
        for (let j = 0 ; j < col.length ; j++)
        {
            var td = document.createElement('td');
            td.innerHTML = tmp[j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    table_wrapper.appendChild(table);
    
    fragment.appendChild(table_wrapper);

    var doc = document.getElementById('table');
    doc.appendChild(fragment);
} 